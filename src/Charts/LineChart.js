import React, { useEffect, useState, useRef } from "react";
import * as dc from "dc";
import * as d3 from "d3";
import * as crossfilter from "crossfilter2/crossfilter";
import Grid from '@material-ui/core/Grid';
import { red } from "@material-ui/core/colors";

const LineChart = ({ params }) => {
    const div = React.useRef(null);
    const div1 = React.useRef(null)

    var chart = null;
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
                return d[params.XAxis];
            }),
            speedSumGroup = runDimension.group().reduceSum(function (d) { return d[params.YAxis] });

        var fmt = d3.format('02d');
        var table_ = ndx.dimension(function (d) { return [fmt(+d[params.XAxis]), fmt(+d[params.YAxis])]; });
        chart = new dc.lineChart(div.current);
        var datatabel = new dc.dataTable(div1.current);
        let PadTop, PadRight, PadBottom, PadLeft = 0
        if (params.PadTop === undefined || params.PadTop === '') PadTop = 0; else PadTop = params.PadTop
        if (params.PadRight === undefined || params.PadRight === '') PadRight = 0; else PadRight = params.PadRight
        if (params.PadBottom === undefined || params.PadBottom === '') PadBottom = 0; else PadBottom = params.PadBottom
        if (params.PadLeft === undefined || params.PadLeft === '') PadLeft = 0; else PadLeft = params.PadLeft
        chart
            .width(params.Width_)
            .height(params.Heigth_)
            .margins({ top: parseInt(10) + parseInt(PadTop), right: parseInt(30) + parseInt(PadRight), bottom: parseInt(50) + parseInt(PadBottom), left: parseInt(30) + parseInt(PadLeft) })
            .x(d3.scaleBand())
            .xUnits(dc.units.ordinal)
            .brushOn(false)

            .dimension(runDimension)
            .group(speedSumGroup, 'test')
            .colors(params.Color === '' || params.Color === undefined ? '#6282b3' : params.Color)
            .title(function (y) {
                var tooltip = params.XAxis + ': ' + y.key + '\n'
                    + params.YAxis + ': ' + y.value

                return ''
            })
            .renderlet(function (chart) {
                //X-Axis 
                chart.selectAll("g.x g.tick text")
                    .attr('dx', params.Rotate === undefined || params.Rotate === '' ? '' : '-10')
                    .attr('text-anchor', params.Rotate === undefined || params.Rotate === '' ? '' : 'end')
                    .attr('transform', `rotate(${params.Rotate})`)
                    .style("font-family", params.xFont)
                    .style("color", params.xColor)
                    .style("font-size", params.xSize + "px")

                //y-Axis 
                chart.selectAll("g.y g.tick text")
                    .attr('dx', '-10')
                    .attr('text-anchor', 'end')
                    // .attr('transform', `rotate(${params.Rotate})`)
                    .style("font-family", params.yFont)
                    .style("color", params.yColor)
                    .style("font-size", params.ySize + "px")

                //X-Axis Label
                chart.selectAll(".x-axis-label")
                    .style("font-family", params.xlFont)
                    .style("fill", params.xlColor)
                    .style("font-size", params.xlSize + "px")
                    .style("display", params.Axesswatch === undefined ? 'none' : params.Axesswatch)


                //Y-Axis Label
                chart.selectAll(".y-axis-label")
                    .style("font-family", params.ylFont)
                    .style("fill", params.ylColor)
                    .style("font-size", params.ylSize + "px")
                    .style("display", params.Axesswatch === undefined ? 'none' : params.Axesswatch)

            })
            .yAxisLabel(params.YAxisLabel)
            .xAxisLabel(params.XAxisLabel)
        chart.yAxis().tickFormat(function (v) { return BMK(v); })

        datatabel
            .width(300)
            .height(480)
            .dimension(table_)
            .size(Infinity)
            .showSections(false)
            .columns(params.XAxis_.map((e) => e.split(' ').slice(1, 3).join(' ')))
            //  .sortBy(function (d) { return [fmt(+d.Expt), fmt(+d.Run)]; })
            .order(d3.ascending)

            .on('preRender', update_offset)
            .on('preRedraw', update_offset)
            .on('pretransition', display);

        dc.renderAll();
        d3.select('body').on('mouseover', function () {

            d3.selectAll('.dot')
                .on("mouseover", function (d) {
                    div2.transition()
                        .duration(500)
                        .style("opacity", params.Tooltipswatch)
                    // .style("font-family", params.TooltipFont)
                    // .style("color", params.TooltipColor)
                    // .style("font-size", params.TooltipSize + "px")
                    // .style("background-color", params.TooltipBGColor)
                    // .style("border", params.TooltipThickness + 'px ' + params.TooltipTickColor + ' solid')

                    if (params.TooltipContent === 'X') {
                        div2.html('<div><div><b>'
                            + params.XAxis + '</b> : ' + d.target.__data__.x + '</div><div>')
                    }
                    else if (params.TooltipContent === 'Y') {
                        if (params.YAxis === undefined || params.YAxis === 'Select') {
                            div2.html('<div><div><b>'
                                + 'Count </b> : ' + d.target.__data__.y + '</div><div>')
                        }
                        else {
                            div2.html('<div><div><b>'
                                + params.YAxis + '</b> : ' + d.target.__data__.y + '</div><div>')
                        }
                    }
                    else if (params.TooltipContent === 'All') {
                        if (params.YAxis === undefined || params.YAxis === 'Select') {
                            div2.html('<div><div><b>'
                                + params.XAxis + '</b> : ' + d.target.__data__.x + '</div><div><b>'
                                + 'Count </b> : ' + d.target.__data__.y + '</div></div>')
                        }
                        else {
                            div2.html('<div><div><b>'
                                + params.XAxis + '</b> : ' + d.target.__data__.x + '</div><div><b>'
                                + params.YAxis + '</b> : ' + d.target.__data__.y.toFixed(2) + '</div></div>')
                        }
                    }

                    div2.style("left", (d.pageX) + "px")
                        .style("top", (d.pageY - 50) + "px");
                })
                .on("mouseout", function (d) {
                    div2.transition()
                        .duration(500)
                        .style("opacity", 0)

                    d3.selectAll('circle.dot').style("fill-opacity", "1e-06")
                        .style("stroke-opacity", "1e-06")
                    d3.selectAll('path.yRef')
                        .attr('d', '')
                    d3.selectAll('path.xRef')
                        .attr('d', '')
                })
        });
        function BMK(labelValue) {
            // Nine Zeroes for Billions
            return Math.abs(Number(labelValue)) >= 1.0e9
                ? Math.abs(Number(labelValue)) / 1.0e9 + "B"
                : // Six Zeroes for Millions
                Math.abs(Number(labelValue)) >= 1.0e6
                    ? Math.abs(Number(labelValue)) / 1.0e6 + "M"
                    : // Three Zeroes for Thousands
                    Math.abs(Number(labelValue)) >= 1.0e3
                        ? Math.abs(Number(labelValue)) / 1.0e3 + "K"
                        : Math.abs(Number(labelValue));
        }
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
            <div style={{ backgroundColor: params.Lineswatch === 'show' ? params.BGColor : '', display: params.Titleswatch === undefined ? 'none' : params.Titleswatch }}>
                <span style={{ fontFamily: params.TitleFont, fontSize: params.TitleSize, color: params.TitleColor }}>{params.Title}</span>

            </div>
        );
    };

    return (
        <Grid item xs={12} sm={12} md={12} xl={4} lg={12}>
            <Grid item className="cardbox" xs={12} sm={12} md={12} xl={4} lg={12}>
                <Chartheader />
                <div style={{ backgroundColor: params.Lineswatch === 'show' ? params.BGColor : '' }}>
                    <div id="Charts" ref={div} className="boxcenter">
                    </div>
                </div>
            </Grid>
            <Grid item className="cardbox" xs={12} sm={12} md={12} xl={4} lg={12}>
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
export default LineChart



