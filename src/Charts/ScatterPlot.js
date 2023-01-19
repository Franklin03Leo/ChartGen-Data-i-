
import React, { useEffect, useState, useRef } from "react";
import * as dc from "dc";
import * as d3 from "d3";
import * as crossfilter from "crossfilter2/crossfilter";
import Grid from '@material-ui/core/Grid';
import { legend } from "dc";

const Scatter = ({ params }) => {
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
        const Max = experiments.map(object => {
            return object[params.XAxis];
        })
        var ndx = crossfilter(experiments),
            runDimension = ndx.dimension(function (d) {
                return [+d[params.XAxis], +d[params.YAxis]];
            })

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
        var speedSumGroup = ''
        if (params.YAxis !== undefined && params.YAxis !== 'Select') {
            if (params.GroupByCol === 'Sum') {
                speedSumGroup = runDimension.group().reduceSum(function (d) { return d[params.YAxis] });
            }
            else if (params.GroupByCol === 'Count') {
                speedSumGroup = runDimension.group().reduceCount(function (d) { return d[params.YAxis] });
            }
            else if (params.GroupByCol === 'Average') {
                speedSumGroup = runDimension.group().reduce(
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
                speedSumGroup = runDimension.group().reduce(groupArrayAdd(YKey), groupArrayRemove(YKey), groupArrayInit);
            }
            else if (params.GroupByCol === 'Maximum') {
                speedSumGroup = runDimension.group().reduce(groupArrayAdd(YKey), groupArrayRemove(YKey), groupArrayInit);
            }
        }
        else {
            speedSumGroup = runDimension.group().reduceCount(function (d) { return d[params.XAxis] });
        }

        var fmt = d3.format('02d');
        var table_ = ndx.dimension(function (d) { return [fmt(+d[params.XAxis]), fmt(+d[params.YAxis])]; });
        var chart = new dc.scatterPlot(div.current);
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
            .title(function (y) {
                var tooltip = params.XAxis + ': ' + y.key[0] + '\n'
                    + params.YAxis + ': ' + y.key[1]

                return ''
            })
            .elasticY(true)
            .renderLabel(true)
            .label(function (d) {
                if (params.LabelsContent === 'X')
                    return d.x
                else if (params.LabelsContent === 'Y')
                    return d.y.toFixed(2)
                else if (params.LabelsContent === 'Title')
                    return params.YAxis
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

                chart.selectAll(".barLabel")
                    .style("font-family", params.LabelsFont)
                    .style("fill", params.LabelsColor)
                    .style("font-size", params.Labelsize + "px")
                    .style("display", params.Labelsswatch !== undefined ? params.Labelsswatch : 'none')


            })
            .yAxisLabel(params.YAxisLabel)
            .xAxisLabel(params.XAxisLabel)
        if (params.GroupByCol === 'Average') {
            chart.valueAccessor(function (d) {
                return d.value.average;
            })
        }
        else if (params.GroupByCol === 'Minimum') {
            chart.valueAccessor(minSpeed)
        }
        else if (params.GroupByCol === 'Maximum') {
            chart.valueAccessor(maxSpeed)
        }
        chart.yAxis().tickFormat(function (v) { return BMK(v); })
        // .legend(new legend().x(0).y(10).itemHeight(13).gap(5).horizontal(true))

        datatabel
            .width(300)
            .height(480)
            .dimension(table_)
            .size(Infinity)
            .showSections(false)
            .columns(params.GroupByCopy_.map((e) => e.split(' ').slice(1, 3).join(' ')))
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
        <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
            <Grid item className="cardbox chartbox">
                <Chartheader />
                <div style={{ backgroundColor: params.Scatterswatch === 'show' ? params.BGColor : '' }}>
                    <div id="Charts" ref={div} className="boxcenter">
                    </div>
                </div>
            </Grid>
            <Grid item className="cardbox chartbox" style={{display: params.Width_ === null ? 'none' : 'block' }}>

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