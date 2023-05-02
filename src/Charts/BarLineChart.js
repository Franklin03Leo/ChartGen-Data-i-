import React, { useEffect, useState, useRef } from "react";
import * as dc from "dc";
//import * as d3 from "d3";
import * as crossfilter from "crossfilter2/crossfilter";
import Grid from '@material-ui/core/Grid';
import * as d3module from 'd3'
import d3tip from 'd3-tip'
import { legend } from "dc";
const BarLineChart = ({ params }) => {
    const div = React.useRef(null);
    const div1 = React.useRef(null);
    const d3 = {
        ...d3module,
        tip: d3tip
    }
    React.useEffect(() => {
        var div2 = d3.select("#Charts").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("font-family", params.TooltipFont)
            .style("color", params.TooltipColor)
            .style("font-size", params.TooltipSize + "px")
            .style("background-color", params.TooltipBGColor)
            .style("border", params.TooltipThickness + 'px ' + params.TooltipTickColor + ' solid')


        var ndx;
        var datatabel = new dc.dataTable(div1.current);

        var experiments = params.Uploaded_file
        var barwidth = 10;

        if (experiments.length < 100) {
            barwidth = 10;
        } else if (experiments.length > 100) {
            barwidth = 20;
        }
        const Max = experiments.map(object => {
            return object[params.XAxis];
        });
        // var chart = new dc.barChart(div.current)
        let compositeChart
        if (params.Width_ !== null)
            compositeChart = new dc.compositeChart(div.current)
        else
            compositeChart = new dc.compositeChart(div.current, 'BarLineChart')
                .title(function (y) {
                    var tooltip = params.XAxis + ': ' + y.key + '\n'
                        + params.YAxis + ': ' + y.value
                    return ''
                })
        ndx = crossfilter(experiments)
        var runDimension = ndx.dimension(function (d) {
            return d[params.XAxis];
        }),
            //speedSumYAxis = runDimension.group().reduceSum(function (d) { return d[params.YAxis] }),

            speedSumGroup = runDimension.group().reduceSum(function (d) { return d[params.GroupBy] })

        var YKey = function (d) { return +d[params.YAxis] }

        function groupArrayAdd(keyfn) {
            var bisect = d3.bisector(keyfn);
            return function (elements, item) {
                var pos = bisect.right(elements, keyfn(item));
                elements.splice(pos, 0, item);
                return elements;
            };
        }

        function groupArrayRemove(keyfn) {
            var bisect = d3.bisector(keyfn);
            return function (elements, item) {
                var pos = bisect.left(elements, keyfn(item));
                if (keyfn(elements[pos]) === keyfn(item))
                    elements.splice(pos, 1);
                return elements;
            };
        }

        function groupArrayInit() {
            return [];
        }
        function minSpeed(kv) {
            return d3.min(kv.value, YKey);
        }
        function maxSpeed(kv) {
            return d3.max(kv.value, YKey);
        }
        var speedSumYAxis = ''
        if (params.YAxis !== undefined && params.YAxis !== 'Select') {
            if (params.GroupByCol === 'Sum') {
                speedSumYAxis = runDimension.group().reduceSum(function (d) { return d[params.YAxis] });
            }
            else if (params.GroupByCol === 'Count') {
                speedSumYAxis = runDimension.group().reduceCount(function (d) { return d[params.YAxis] });
            }
            else if (params.GroupByCol === 'Average') {
                speedSumYAxis = runDimension.group().reduce(
                    //return d.fdl_UniyPrice;
                    //add
                    function (p, v) {
                        ++p.count;
                        p.total += parseInt(v[params.YAxis]);
                        if (p.count == 0) {
                            p.average = 0;
                        } else {
                            p.average = p.total / p.count;
                        }
                        return p;
                    },
                    // remove
                    function (p, v) {
                        --p.count;
                        p.total -= parseInt(v[params.YAxis]);
                        if (p.count == 0) {
                            p.average = 0;
                        } else {
                            p.average = p.total / p.count;
                        }
                        return p;
                    },
                    // initial
                    function () {
                        return {
                            count: 0,
                            total: 0,
                            average: 0
                        };
                    }
                );
            }
            else if (params.GroupByCol === 'Minimum') {
                speedSumYAxis = runDimension.group().reduce(groupArrayAdd(YKey), groupArrayRemove(YKey), groupArrayInit);
            }
            else if (params.GroupByCol === 'Maximum') {
                speedSumYAxis = runDimension.group().reduce(groupArrayAdd(YKey), groupArrayRemove(YKey), groupArrayInit);
            }
        }
        else {
            speedSumYAxis = runDimension.group().reduceCount(function (d) { return d[params.XAxis] });
        }

        var fmt = d3.format('02d');
        var table_ = ndx.dimension(function (d) { return [fmt(+d[params.XAxis]), fmt(+d[params.YAxis])]; });
        let PadTop, PadRight, PadBottom, PadLeft = 0
        if (params.PadTop === undefined || params.PadTop === '') PadTop = 0; else PadTop = params.PadTop
        if (params.PadRight === undefined || params.PadRight === '') PadRight = 0; else PadRight = params.PadRight
        if (params.PadBottom === undefined || params.PadBottom === '') PadBottom = 0; else PadBottom = params.PadBottom
        if (params.PadLeft === undefined || params.PadLeft === '') PadLeft = 0; else PadLeft = params.PadLeft

        let barchart = new dc.barChart(compositeChart)
            .dimension(runDimension)
            .group(speedSumYAxis, params.YAxis)
            .elasticX(true)
            .centerBar(true)
            .gap(10)
            // .renderLabel(true)
            .title(function (y) {
                var tooltip = params.XAxis + ': ' + y.key + '\n'
                    + params.YAxis + ': ' + y.value

                return ''
            });
        if (params.GroupByCol === 'Average') {
            barchart.valueAccessor(function (d) {
                return d.value.average;
            })
        }
        else if (params.GroupByCol === 'Minimum') {
            barchart.valueAccessor(minSpeed)
        }
        else if (params.GroupByCol === 'Maximum') {
            barchart.valueAccessor(maxSpeed)
        };
        let linechart = new dc.lineChart(compositeChart)
            .dimension(runDimension)
            .group(speedSumGroup, params.GroupBy)
            .colors(params.LineColor === undefined ? 'red' : params.LineColor)
            .useRightYAxis(true)
            .curve(d3.curveMonotoneX)
            .renderDataPoints({
                radius: 5,
                fillOpacity: 0.8,
                strokeOpacity: 0.10,
            })
            .title(function (y) {
                var tooltip = params.XAxis + ': ' + y.key + '\n'
                    + params.YAxis + ': ' + y.value

                return ''
            });
        compositeChart
            .width(params.Width_)
            .height(params.Heigth_)
            .margins({ top: parseInt(10) + parseInt(PadTop), right: parseInt(30) + parseInt(PadRight), bottom: parseInt(50) + parseInt(PadBottom), left: parseInt(30) + parseInt(PadLeft) })
            .dimension(runDimension)
            //.xAxisPadding(5)
            .elasticY(true)
            .brushOn(false)
            .transitionDuration(1000)
            .shareTitle(false)
            .x(d3.scaleLinear().domain([0, Math.max(...Max)]))
            .xUnits(function () { return barwidth; })
            .renderHorizontalGridLines(true)
            //.renderLabel(true)

            .legend(new legend().x(0).y(10).itemHeight(13).gap(5).horizontal(params.LengendPosition).legendText(function (d, i) { return d.name; }))

            .compose([barchart, linechart])
            // .on("pretransition", chart => {
            //     scaleSubChartBarWidth(chart)
            // })
            // .on("preRedraw", chart => {
            //     chart.rescale();
            // })
            // .on("preRender", chart => {
            //     chart.rescale();
            // })
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

                //yr-Axis 
                chart.selectAll("g.yr g.tick text")
                    .style("font-family", params.ryFont)
                    .style("color", params.ryColor)
                    .style("font-size", params.rySize + "px")

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
                //Yr-Axis Label
                chart.selectAll(".y-axis-label .yr-label")
                    .style("font-family", params.rylFont)
                    .style("fill", params.rylColor)
                    .style("font-size", params.rylSize + "px")
                    .style("display", params.Axesswatch === undefined ? 'none' : params.Axesswatch)
            })
            .yAxisLabel(params.YAxisLabel)
            .xAxisLabel(params.XAxisLabel)
            .rightYAxisLabel(params.RYAxisLabel)
            .yAxis().tickFormat(function (v) { return v })
        datatabel
            .width(300)
            .height(480)
            .dimension(table_)
            .size(Infinity)
            .showSections(false)
            .columns(params.GroupByCopy_.map((e) => e.split(' ').slice(1, 30).join(' ')))
            .order(d3.ascending)
            .on('preRender', update_offset)
            .on('preRedraw', update_offset)
            .on('pretransition', display);


        if (params.Width_ !== null)
            dc.renderAll()
        else
            dc.renderAll('BarLineChart');
        d3.selectAll("g.dc-legend-item text")
            // .style
            .style("font-family", params.LegendFont)
            .style("fill", params.LegendColor)
            .style("font-size", params.LegendSize)

        d3.selectAll(".dc-legend")
            .style("display", params.Legendswatch === undefined ? 'none' : params.Legendswatch)

        d3.select('body').on('mouseover', function () {

            d3.selectAll('rect.bar')
                .on("mouseover", function (d) {
                    div2.transition()
                        .duration(500)
                        .style("opacity", params.Tooltipswatch)

                    if (params.TooltipContent === 'X') {
                        div2.html('<div><div><b>'
                            + params.XAxis + '</b> : ' + d.target.__data__.x.toFixed(2) + '</div><div>')
                    }
                    else if (params.TooltipContent === 'Y') {
                        if (params.YAxis === undefined || params.YAxis === 'Select') {
                            div2.html('<div><div><b>'
                                + 'Count </b> : ' + d.target.__data__.y + '</div><div>')
                        }
                        else {
                            div2.html('<div><div><b>'
                                + params.YAxis + '</b> : ' + d.target.__data__.y.toFixed(2) + '</div><div>')
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
                                + params.XAxis + '</b> : ' + d.target.__data__.x.toFixed(2) + '</div><div><b>'
                                + params.YAxis + '</b> : ' + d.target.__data__.y.toFixed(2) + '</div></div>')
                        }
                    }
                    div2.style("left", (d.pageX) + "px")
                        .style("top", (d.pageY - 50) + "px");
                })
                .on("mouseout", function (d) {
                    div2.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
            d3.selectAll('.dot')
                .on("mouseover", function (e) {
                    div2.transition()
                        .duration(500)
                        .style("opacity", params.Tooltipswatch)
                    if (params.TooltipContent === 'X') {
                        div2.html('<div><div><b>'
                            + params.XAxis + '</b> : ' + e.target.__data__.x.toFixed(2) + '</div><div>')
                    }
                    else if (params.TooltipContent === 'Y') {
                        if (params.YAxis === undefined || params.YAxis === 'Select') {
                            div2.html('<div><div><b>'
                                + 'Count </b> : ' + e.target.__data__.y + '</div><div>')
                        }
                        else {
                            div2.html('<div><div><b>'
                                + params.GroupBy + '</b> : ' + e.target.__data__.y.toFixed(2) + '</div><div>')
                        }
                    }
                    else if (params.TooltipContent === 'All') {
                        if (params.YAxis === undefined || params.YAxis === 'Select') {
                            div2.html('<div><div><b>'
                                + params.XAxis + '</b> : ' + e.target.__data__.x + '</div><div><b>'
                                + 'Count </b> : ' + e.target.__data__.y + '</div></div>')
                        }
                        else {
                            div2.html('<div><div><b>'
                                + params.XAxis + '</b> : ' + e.target.__data__.x + '</div><div><b>'
                                + params.GroupBy + '</b> : ' + e.target.__data__.y.toFixed(2) + '</div></div>')
                        }
                    }
                    div2.style("left", (e.pageX) + "px")
                        .style("top", (e.pageY - 50) + "px");
                })
                .on("mouseout", function (e) {
                    div2.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
            // chart.renderlet(function (chart) {
            //     //X-Axis 
            //     chart.selectAll("g.x g.tick text")
            //         .attr('dx', params.Rotate === undefined || params.Rotate === '' ? '' : '-10')
            //         .attr('text-anchor', params.Rotate === undefined || params.Rotate === '' ? '' : 'end')
            //         .attr('transform', `rotate(${params.Rotate})`)
            //         .style("font-family", params.xFont)
            //         .style("color", params.xColor)
            //         .style("font-size", params.xSize + "px")

            //     //y-Axis 
            //     chart.selectAll("g.y g.tick text")
            //         .attr('dx', '-10')
            //         .attr('text-anchor', 'end')
            //         // .attr('transform', `rotate(${params.Rotate})`)
            //         .style("font-family", params.yFont)
            //         .style("color", params.yColor)
            //         .style("font-size", params.ySize + "px")

            //     //X-Axis Label
            //     chart.selectAll(".x-axis-label")
            //         .style("font-family", params.xlFont)
            //         .style("fill", params.xlColor)
            //         .style("font-size", params.xlSize + "px")
            //         .style("display", params.Axesswatch !== undefined ? params.Axesswatch : 'none')

            //     //Y-Axis Label
            //     chart.selectAll(".y-axis-label")
            //         .style("font-family", params.ylFont)
            //         .style("fill", params.ylColor)
            //         .style("font-size", params.ylSize + "px")
            //         .style("display", params.Axesswatch !== undefined ? params.Axesswatch : 'none')

            // })

        });
        //});
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

        function BMKlabel(labelValue) {
            // Nine Zeroes for Billions
            return Math.abs(Number(labelValue)) >= 1.0e9
                ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(1) + "B"
                : // Six Zeroes for Millions
                Math.abs(Number(labelValue)) >= 1.0e6
                    ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(1) + "M"
                    : // Three Zeroes for Thousands
                    Math.abs(Number(labelValue)) >= 1.0e3
                        ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(1) + "K"
                        : Math.abs(Number(labelValue)).toFixed(1);
        }


        var ofs = 0, pag = 100;

        function update_offset() {
            var totFilteredRecs = ndx.groupAll().value();
            // pag = totFilteredRecs;
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
        // function next() {
        //   ofs += pag;
        //   update_offset();
        //   datatabel.redraw();
        // }
        // function last() {
        //   ofs -= pag;
        //   update_offset();
        //   datatabel.redraw();
        // }

        // last();
        // next()
    });
    const Chartheader = () => {
        return (
            <div style={{ backgroundColor: params.Barswatch === 'show' ? params.BGColor : '', display: params.Titleswatch === undefined ? 'none' : params.Titleswatch }}>
                <span style={{ fontFamily: params.TitleFont, fontSize: params.TitleSize, color: params.TitleColor }}>{params.Title}</span>
            </div>
        );
    };

    return (
        <Grid item xs={12} md={12} xl={12} lg={12}>
            <Grid item className="cardbox chartbox" style={{ padding: '0px 10px' }}>
                <Chartheader />
                <div style={{ backgroundColor: params.Barswatch === 'show' ? params.BGColor : '' }}>
                    <div id="Charts" ref={div} className="boxcenter">
                    </div>
                </div>
            </Grid>

            <Grid item className="cardbox chartbox" style={{ display: params.Width_ === null ? 'none' : 'block' }}>
                {/* <input id="last" className="btn" type="Button" value="Last" />
              <input id="next" className="btn" type="button" value="Next" /> */}
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

export default React.memo(BarLineChart);