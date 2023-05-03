import React from "react";
import * as dc from "dc";
import * as d3 from "d3";
import * as crossfilter from "crossfilter2/crossfilter";
import Grid from '@material-ui/core/Grid';
import { legend } from "dc";

const SunBurstChart = ({ params }) => {
    const div = React.useRef(null);
    const div1 = React.useRef(null)
    React.useEffect(() => {
        var div2 = d3.select("#Charts").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("font-family", params.TooltipFont)
            .style("color", params.TooltipColor)
            .style("font-size", params.TooltipSize + "px")
            .style("background-color", params.TooltipBGColor)
            .style("border", params.TooltipThickness + 'px ' + params.TooltipTickColor + ' solid')
        var experiments = params.Uploaded_file
        var ndx = crossfilter(experiments),
            runDimension = ndx.dimension(function (d) {
                return [d[params.XAxis], d[params.YAxis]];
            })
        var speedSumGroup = runDimension.group().reduceSum(function (d) { return d[params.YAxis] });

        var fmt = d3.format('02d');
        var table_ = ndx.dimension(function (d) { return [fmt(+d[params.XAxis]), fmt(+d[params.YAxis])]; });
        var SunBurst, datatabel;
        if (params.Width_ !== null) {
            SunBurst = new dc.sunburstChart(div.current);
            datatabel = new dc.dataTable(div1.current);
        }
        else {
            SunBurst = new dc.sunburstChart(div.current, 'Chart');
            datatabel = new dc.dataTable(div1.current, 'Table');
        }
        SunBurst
            .width(params.Width_)
            .height(params.Heigth_)
            .innerRadius(params.Innerradius)
            .dimension(runDimension)
            .group(speedSumGroup)
        if (params.Legendswatch !== undefined)
            SunBurst.legend(new legend().x(10).y(10).itemHeight(13).gap(5).horizontal(params.LengendPosition).legendText(function (d, i) { return d.name; }))

        datatabel
            .width(300)
            .height(480)
            .dimension(table_)
            .size(Infinity)
            .showSections(false)
            .columns(params.GroupByCopy_.map((e) => e.split(' ').slice(1, 30).join(' ')))
            .sortBy(function (d) { return [fmt(+d.Expt), fmt(+d.Run)]; })
            .order(d3.ascending)

            .on('preRender', update_offset)
            .on('preRedraw', update_offset)
            .on('pretransition', display)
        dc.renderAll();

        var ofs = 0, pag = 100;

        function update_offset() {
            var totFilteredRecs = ndx.groupAll().value();
            var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
            if (ofs == undefined || pag == undefined) {
                ofs = 0;
                pag = totFilteredRecs;
            }
            ofs = ofs >= totFilteredRecs ? Math.floor((totFilteredRecs - 1) / pag) * pag : ofs;
            ofs = ofs < 0 ? 0 : ofs;
            datatabel.beginSlice(ofs);
            datatabel.endSlice(ofs + pag);
        }
        function display() {
            var totFilteredRecs = ndx.groupAll().value();
            var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
            d3.select('#begin')
                .text(end === 0 ? ofs : ofs + 1);
            d3.select('#end')
                .text(end);
            d3.select('#last')
                .attr('disabled', ofs - pag < 0 ? 'true' : null);
            d3.select('#next')
                .attr('disabled', ofs + pag >= totFilteredRecs ? 'true' : null);
            d3.select('#size').text(totFilteredRecs);
            if (totFilteredRecs != ndx.size()) {
                d3.select('#totalsize').text("(filtered Total: " + ndx.size() + " )");
            } else {
                d3.select('#totalsize').text('');
            }
        }
        function next() {
            ofs += pag;
            update_offset();
            datatabel.redraw();
        }
        function last() {
            ofs -= pag;
            update_offset();
            datatabel.redraw();
        }
    })

    const Chartheader = () => {
        return (
            <div style={{ backgroundColor: params.Pieswatch === 'show' ? params.BGColor : '', display: params.Titleswatch === undefined ? 'none' : params.Titleswatch }}>
                <span style={{ fontFamily: params.TitleFont, fontSize: params.TitleSize, color: params.TitleColor }}>{params.Title}</span>
            </div>
        );
    };

    return (
        <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
            <Grid item className="cardbox chartbox">
                <Chartheader />
                <div style={{ backgroundColor: params.Pieswatch === 'show' ? params.BGColor : '' }}>
                    <div id="Charts" ref={div} className="boxcenter">
                    </div>
                </div>
            </Grid>
            <Grid item className="cardbox chartbox" style={{ display: params.Width_ === null ? 'none' : 'block' }}>
            <div id="table-scroll" className="table-scroll">
              <div className="table-wrap">
                <table ref={div1} className="main-table">
                </table>
              </div>
              <div id="paging" style={{ float: "right" }}>
                Showing <span id="begin"></span>-<span id="end"></span> of <span id="size"></span> <span id="totalsize" style={{ display: 'none' }}></span>
              </div>
            </div>
          </Grid>
        </Grid>
    );
}

export default React.memo(SunBurstChart);