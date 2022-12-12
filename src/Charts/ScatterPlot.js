
import React, { useEffect, useState, useRef } from "react";
import * as dc from "dc";
import * as d3 from "d3";
import * as crossfilter from "crossfilter2/crossfilter";
import Grid from '@material-ui/core/Grid';
import { legend } from "dc";

const Scatter = ({ params }) => {
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
        const Max = experiments.map(object => {
            return object[params.XAxis];
        })
        var ndx = crossfilter(experiments),
            runDimension = ndx.dimension(function (d) {
                return [+d[params.XAxis], +d[params.YAxis]];
            }),
            speedSumGroup = runDimension.group()

        var fmt = d3.format('02d');
        var table_ = ndx.dimension(function (d) { return [fmt(+d[params.XAxis]), fmt(+d[params.YAxis])]; });
        chart = new dc.scatterPlot(div.current);
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

            .x(d3.scaleLinear().domain([Math.min(...Max), Math.max(...Max) + Math.min(...Max)]))
            .brushOn(false)
            .symbolSize(params.SymbolSize)
            .clipPadding(10)

            .dimension(runDimension, params.YAxis)
            .group(speedSumGroup, params.YAxis)
            // .colorAccessor(function (d) {
            //     if (d != undefined) {
            //         debugger
            //         return d.key[1] >= 0 ? 'blue' : 'red'
            //     }
            // })
            // .colorAccessor(['red', 'blue'])
            .title(function (y) {
                var tooltip = params.XAxis + ': ' + y.key[0] + '\n'
                    + params.YAxis + ': ' + y.key[1]

                return ''
            })
            .renderlet(function (chart) {
                chart.selectAll("path.symbol")
                    .attr('fill', function (d) {
                        if (d != undefined) {
                            if (d.key[1] >= 0) {
                                return params.Scatterswatch === 'show' ? params.Color : '#6282b3';
                            }
                            else {
                                return 'Red';
                            }
                        }
                    })

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
        // .legend(new legend().x(0).y(10).itemHeight(13).gap(5).horizontal(true))

        datatabel
            .width(300)
            .height(480)
            .dimension(table_)
            .size(Infinity)
            .showSections(false)
            .columns(params.XAxis_)
            .order(d3.ascending)

            .on('preRender', update_offset)
            .on('preRedraw', update_offset)
            .on('pretransition', display);

        dc.renderAll();
        d3.select('body').on('mouseover', function () {

            d3.selectAll('.symbol')
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
                        div2.html('<div><div><b>' + params.XAxis + '</b> : ' + d.target.__data__['key'][0] + '</div><div>')
                    }
                    else if (params.TooltipContent === 'Y') {
                        div2.html('<div><div><b>' + params.XAxis + '</b> : ' + d.target.__data__['key'][1].toFixed(2) + '</div><div>')
                    }
                    else if (params.TooltipContent === 'All') {
                        div2.html('<div><div><b>'
                            + params.XAxis + '</b> : ' + d.target.__data__['key'][0] + '</div><div><b>'
                            + params.YAxis + '</b> : ' + d.target.__data__['key'][1].toFixed(2) + '</div></div>')
                    }
                    div2.style("left", (d.pageX) + "px")
                        .style("top", (d.pageY - 50) + "px");
                })
                .on("mouseout", function (d) {
                    div2.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        });
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

    const Chartheader = () => {
        return (
            <div style={{ backgroundColor: params.Scatterswatch === 'show' ? params.BGColor : '', display: params.Titleswatch === undefined ? 'none' : params.Titleswatch }}>
                <span style={{ fontFamily: params.TitleFont, fontSize: params.TitleSize, color: params.TitleColor }}>{params.Title}</span>

            </div>
        );
    };

    return (
        <Grid item xs={12} sm={12} md={12} xl={4} lg={12}>
            <Grid item className="cardbox">
                <Chartheader />
                <div style={{ backgroundColor: params.Scatterswatch === 'show' ? params.BGColor : '' }}>
                    <div id="Charts" ref={div} className="boxcenter">
                    </div>
                </div>
            </Grid>
            <Grid item className="cardbox">

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
export default Scatter