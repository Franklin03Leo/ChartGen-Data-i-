
import React, { useEffect, useState, useRef } from "react";
import * as dc from "dc";
import * as d3 from "d3";
import * as crossfilter from "crossfilter2/crossfilter";
import Grid from '@material-ui/core/Grid';
const Table = () => {
    const div1 = React.useRef(null)
    React.useEffect((params) => {
        if(params == undefined) return
        var experiments = params.Uploaded_file
        var ndx = crossfilter(experiments)
        var fmt = d3.format('02d');
        var table_ = ndx.dimension(function (d) { return [fmt(+d[params.XAxis]), fmt(+d[params.YAxis])]; });
        var datatabel = new dc.dataTable(div1.current);
        datatabel
            .width(300)
            .height(480)
            .dimension(table_)
            .size(Infinity)
            .showSections(false)
            .columns(params.XAxis_)
            //.sortBy(function (d) { return [fmt(+d.Expt), fmt(+d.Run)]; })
            .order(d3.ascending)

            .on('preRender', update_offset)
            .on('preRedraw', update_offset)
            .on('pretransition', display);

        dc.renderAll();



        var ofs = 0, pag = 100;

        function update_offset() {
            var totFilteredRecs = ndx.groupAll().value();
            var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
            if (ofs == undefined || pag == undefined) {
                ofs = 0;
                pag = 10;
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

        last();
        next()

    })
    return (
        <Grid item xs={12} sm={12} md={12} xl={4} lg={12}>
            <Grid item className="cardbox">
                <div id="table-scroll" className="table-scroll">
                    <div className="table-wrap">

                        <table ref={div1} className="main-table">
                        </table>
                    </div>
                </div>
            </Grid>
        </Grid>
    )
}
export default Table;





































// import React, { useEffect, useState, useRef } from "react";
// import * as dc from "dc";
// import * as d3 from "d3";
// import * as crossfilter from "crossfilter2/crossfilter";
// import Grid from '@material-ui/core/Grid';
// import { legend } from "dc";

// const Scatter = ({ params }) => {
//     const div = React.useRef(null);
//     const div1 = React.useRef(null)
//     var chart = null;
//     React.useEffect(() => {
//         var experiments = params.Uploaded_file
//         const Max = experiments.map(object => {
//             return object[params.XAxis];
//         })
//         var ndx = crossfilter(experiments),
//             runDimension = ndx.dimension(function (d) {
//                 return [+d[params.XAxis], +d[params.YAxis]];
//             }),
//             speedSumGroup = runDimension.group().reduceSum(function (d) { return +d.Profit; });

//         var fmt = d3.format('02d');
//         var table_ = ndx.dimension(function (d) { return [fmt(+d[params.XAxis]), fmt(+d[params.YAxis])]; });
//         chart = new dc.seriesChart(div.current);
//         var datatabel = new dc.dataTable(div1.current);
//         var symbolScale = d3.scaleOrdinal().range(d3.symbols);
//         //var symbolAccessor = function (d) { return symbolScale(d.key[0]); };
//         var subChart = function (c) {
//             return new dc.scatterPlot(c)
//                // .symbol(symbolAccessor)
//                 .symbolSize(8)
//                 .highlightedSize(10)
//         };
//         chart
//             .width(params.width_)
//             .height(params.Heigth_)
//             .chart(subChart)
//             .margins({ top: 30, right: 12, bottom: 80, left: 40 })
//             .x(d3.scaleLinear().domain([Math.min(...Max), Math.max(...Max) + Math.min(...Max)]))
//             .brushOn(true)
//             //.symbolSize(params.SymbolSize)
//             .clipPadding(10)
//             .yAxisLabel(params.YAxisLabel)
//             .xAxisLabel(params.XAxisLabel)
//             .dimension(runDimension, 'dsf')
//             .group(speedSumGroup, 'sdfs')

//             //.mouseZoomable(false)
//             .shareTitle(false) // allow default scatter title to work
//             .seriesAccessor(function (d) { return "Expt: " + d.key[0]; })
//             .keyAccessor(function (d) { return +d.key[1]; })
//             .valueAccessor(function (d) { return +d.value; })
//             .legend(dc.legend().x(0).y(10).itemHeight(13).gap(5).horizontal(true).legendWidth(140).itemWidth(70))

//             // chart.colorAccessor(function (d) {
//             //     if (d != undefined) {
//             //         return d.key[1] > 0 ? 'Profit' : 'Loss'
//             //     }
//             // })
//             // .seriesAccessor(function(d) {return "Expt: " + d.key[0];})
//             // .keyAccessor(function(d) {return +d.key[1];})
//             // .valueAccessor(function(d) {return +d.key[1]})
//             // .legend(dc.legend().x(350).y(350).itemHeight(13).gap(5).horizontal(1).legendWidth(140).itemWidth(70))
//             .title(function (y) {
//                 var tooltip = params.XAxis + ': ' + y.key[0] + '\n'
//                     + params.YAxis + ': ' + y.key[1]

//                 return tooltip
//             })
//     // .renderlet(function (chart) {
//     //     chart.selectAll("path.symbol")
//     //         .attr('fill', function (d) {
//     //             if (d != undefined) {
//     //                 if (d.key[1] > 0) {
//     //                     return 'RED';
//     //                 }
//     //                 else {
//     //                     return 'GREEN';
//     //                 }
//     //             }
//     //         })

//     // })
//     // .legend(new legend().x(0).y(10).itemHeight(13).gap(5).horizontal(true).legendText(function (d, i) {
//     //     debugger
//     //     return d.name;
//     // }))
//     // .renderlet(function (chart) {
//     //     chart.selectAll("path.symbol title")

//     // })
//     datatabel
//         .width(300)
//         .height(480)
//         .dimension(table_)
//         .size(Infinity)
//         .showSections(false)
//         .columns(params.XAxis_)
//         //  .sortBy(function (d) { return [fmt(+d.Expt), fmt(+d.Run)]; })
//         .order(d3.ascending)

//         .on('preRender', update_offset)
//         .on('preRedraw', update_offset)
//         .on('pretransition', display);

//     dc.renderAll();

//     var ofs = 0, pag = 100;

//     function update_offset() {
//         var totFilteredRecs = ndx.groupAll().value();
//         var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
//         if (ofs == undefined || pag == undefined) {
//             ofs = 0;
//             pag = totFilteredRecs;
//         }
//         ofs = ofs >= totFilteredRecs ? Math.floor((totFilteredRecs - 1) / pag) * pag : ofs;
//         ofs = ofs < 0 ? 0 : ofs;
//         datatabel.beginSlice(ofs);
//         datatabel.endSlice(ofs + pag);
//     }
//     function display() {
//         var totFilteredRecs = ndx.groupAll().value();
//         var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
//         d3.select('#begin')
//             .text(end === 0 ? ofs : ofs + 1);
//         d3.select('#end')
//             .text(end);
//         d3.select('#last')
//             .attr('disabled', ofs - pag < 0 ? 'true' : null);
//         d3.select('#next')
//             .attr('disabled', ofs + pag >= totFilteredRecs ? 'true' : null);
//         d3.select('#size').text(totFilteredRecs);
//         if (totFilteredRecs != ndx.size()) {
//             d3.select('#totalsize').text("(filtered Total: " + ndx.size() + " )");
//         } else {
//             d3.select('#totalsize').text('');
//         }
//     }
//     function next() {
//         ofs += pag;
//         update_offset();
//         datatabel.redraw();
//     }
//     function last() {
//         ofs -= pag;
//         update_offset();
//         datatabel.redraw();
//     }
// })

// const Chartheader = () => {
//     return (
//         <div>
//             <span style={{ fontWeight: "bold" }}>{params.Title}</span>
//         </div>
//     );
// };

// return (
//     <Grid item xs={12} sm={12} md={12} xl={4} lg={12}>
//         <Grid item className="cardbox">
//             <Chartheader />
//             <div>
//                 <div ref={div} className="boxcenter" style={{ height: "360px" }}>
//                 </div>
//             </div>
//         </Grid>
//         <Grid item className="cardbox">

//             <div id="table-scroll" className="table-scroll">
//                 <div className="table-wrap">
//                     <table ref={div1} className="main-table">
//                     </table>
//                 </div>
//                 <div id="paging" style={{ float: "right" }}>
//                     Showing <span id="begin"></span>-<span id="end"></span> of <span id="size"></span> <span id="totalsize" style={{ display: 'none' }}></span>
//                 </div>
//             </div>
//         </Grid>
//     </Grid>
// );
// }
// export default Scatter