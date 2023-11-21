import React from "react";
import * as dc from "dc";
import * as d3 from "d3";
import * as crossfilter from "crossfilter2/crossfilter";
import Grid from '@material-ui/core/Grid';
const BarLineChart = ({ params }) => {
    const div = React.useRef(null);
    const div1 = React.useRef(null)
    const div3 = React.useRef(null)

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
        const timeFormat = d3.timeFormat('%Y-%m-%d');
        const timeFormat_ = d3.timeFormat('%m-%d-%Y');

        // experiments.forEach(function (x) {
        //     if (new Date(x[params.XAxis]) == 'Invalid Date')
        //         x[params.XAxis] = new Date(x[params.XAxis].toString().split('-').reverse().join('/'))
        //     else
        //         x[params.XAxis] = new Date(x[params.XAxis])
        // })
        var ndx = crossfilter(experiments),

            runDimension = ndx.dimension(function (d) {
                return [d.Discount];
            }),
            speedSumYAxis = runDimension.group().reduceSum(function (d) { return d.Quantity }),

            speedSumGroup = runDimension.group().reduceSum(function (d) { return d.Sales })


        var fmt = d3.format('02d');
        var table_ = ndx.dimension(function (d) { return [fmt(+d[params.XAxis])]; });
        let composite = new dc.compositeChart(div.current)
        var datatabel = new dc.dataTable(div1.current);

        let PadTop, PadRight, PadBottom, PadLeft = 0
        if (params.PadTop === undefined || params.PadTop === '') PadTop = 0; else PadTop = params.PadTop
        if (params.PadRight === undefined || params.PadRight === '') PadRight = 0; else PadRight = params.PadRight
        if (params.PadBottom === undefined || params.PadBottom === '') PadBottom = 0; else PadBottom = params.PadBottom
        if (params.PadLeft === undefined || params.PadLeft === '') PadLeft = 0; else PadLeft = params.PadLeft
        let barchart = new dc.barChart(composite)
            .dimension(runDimension)

            .group(speedSumYAxis)
            // .yAxisPadding("10%")
            // .x(d3.scaleBand())
             .elasticY(true)
            //.xUnits(dc.units.ordinal)
            // .yAxisPadding(10)
            .centerBar(true);
        let linechart = new dc.lineChart(composite)
            .dimension(runDimension)

            .group(speedSumGroup, 'Sppen')
            .colors('red')
            //.dashStyle([2, 2])
            .useRightYAxis(true)
            .curve(d3.curveMonotoneX)
            .renderDataPoints({
                radius: 5,
                fillOpacity: 0.8,
                strokeOpacity: 0.10,
                // strokeWidth: 10,
                // lineThickness: 5,
            });
        composite
            .width(897)
            .height(453)

             .margins({ top: parseInt(10) + parseInt(PadTop), right: parseInt(30) + parseInt(PadRight), bottom: parseInt(50) + parseInt(PadBottom), left: parseInt(30) + parseInt(PadLeft) })
             .xAxisPadding(5)

            //.chart(function (c) { return new dc.lineChart(c).curve(d3.curveCardinal).evadeDomainFilter(true) })
            // .x(d3.scaleLinear())
            // .x(d3.scaleLinear()).xAxisPadding(0.5).elasticY(true)
            .x(d3.scaleLinear())
            .xUnits(function () { return 20; })
            .yAxisLabel("The Y Axis")
            .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
            .renderHorizontalGridLines(true)
            //.dimension(runDimension)
            //.renderLabel(true)
            .compose([barchart, linechart])

            //.legend(dc.legend().x(0).y(10).itemHeight(13).gap(5).horizontal(true).legendWidth(140).itemWidth(70))
            // .renderlet(function (chart) {
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
            //         .style("display", params.Axesswatch === undefined ? 'none' : params.Axesswatch)


            //     //Y-Axis Label
            //     chart.selectAll(".y-axis-label")
            //         .style("font-family", params.ylFont)
            //         .style("fill", params.ylColor)
            //         .style("font-size", params.ylSize + "px")
            //         .style("display", params.Axesswatch === undefined ? 'none' : params.Axesswatch)

            // })
            // .yAxisLabel(params.YAxisLabel)
            // .xAxisLabel(params.XAxisLabel)

            // datatabel
            //     .width(300)
            //     .height(480)
            //     .dimension(table_)
            //     .size(Infinity)
            //     .showSections(false)
            //     .columns(params.XAxis_)
            //     .group(function (d) {
            //         return ''
            //     })
            //     //  .sortBy(function (d) { return [fmt(+d.Expt), fmt(+d.Run)]; })
            //     .order(d3.ascending)
            //     .on('renderlet', table => {
            //         table.selectAll('.dc-table-group').classed('info', true);
            //     })
            //     .on('preRender', update_offset)
            //     .on('preRedraw', update_offset)
            //     .on('pretransition', display)
            .brushOn(false)
            .render();
        // d3.selectAll("g.dc-legend-item text")
        //     // .style
        //     .style("font-family", params.LegendFont)
        //     .style("fill", params.LegendColor)
        //     .style("font-size", params.LegendSize)

        // d3.selectAll(".dc-legend")
        //     .style("display", params.Legendswatch === undefined ? 'none' : params.Legendswatch)


        // d3.select('body').on('mouseover', function () {

        //     d3.selectAll('circle.dot')
        //         .on("mouseover", function (d) {
        //             div2.transition()
        //                 .duration(500)
        //                 .style("opacity", params.Tooltipswatch)
        //             // .style("font-family", params.TooltipFont)
        //             // .style("color", params.TooltipColor)
        //             // .style("font-size", params.TooltipSize + "px")
        //             // .style("background-color", params.TooltipBGColor)
        //             // .style("border", params.TooltipThickness + 'px ' + params.TooltipTickColor + ' solid')
        //             if (params.TooltipContent === 'X') {
        //                 div2.html('<div><div><b>' + params.XAxis + '</b> : ' + timeFormat_(d.target.__data__.x) + '</div><div')
        //             }
        //             else if (params.TooltipContent === 'Y') {
        //                 div2.html('<div><div><b>' + params.YAxis + '</b> : ' + d.target.__data__.y.toFixed(2) + '</div><div')
        //             }
        //             else if (params.TooltipContent === 'Group') {
        //                 div2.html('<div><div><b>' + params.GroupBy + '</b> : ' + d.target.__data__.layer + '</div><div>')
        //             }
        //             else if (params.TooltipContent === 'All') {
        //                 div2.html('<div><div><b>' + params.GroupBy + '</b> : ' + d.target.__data__.layer + '</div><div><b>'
        //                     + params.XAxis + '</b> : ' + timeFormat_(d.target.__data__.x) + '</div><div><b>'
        //                     + params.YAxis + '</b> : ' + d.target.__data__.y.toFixed(2) + '</div></div>')
        //             }
        //             div2.style("left", (d.pageX) + "px")
        //                 .style("top", (d.pageY - 50) + "px");
        //         })
        //         .on("mouseout", function (d) {
        //             div2.transition()
        //                 .duration(500)
        //                 .style("opacity", 0)

        //             d3.selectAll('circle.dot').style("fill-opacity", "1e-06")
        //                 .style("stroke-opacity", "1e-06")
        //             d3.selectAll('path.yRef')
        //                 .attr('d', '')
        //             d3.selectAll('path.xRef')
        //                 .attr('d', '')
        //         })

        // });
        // function getRandomColor(obj) {
        //     var colors_ = []
        //     var letters = 'fdb0731458e2679c0a'.split('');
        //     for (var j = 0; j <= obj; j++) {
        //         var color = '#';
        //         for (var i = 0; i < 6; i++) {
        //             color += letters[Math.floor(Math.random() * 18)];
        //         }
        //         colors_.push(color);

        //     }
        //     return colors_;

        // }
        // function BMK(labelValue) {
        //     // Nine Zeroes for Billions
        //     return Math.abs(Number(labelValue)) >= 1.0e9
        //         ? Math.abs(Number(labelValue)) / 1.0e9 + "B"
        //         : // Six Zeroes for Millions
        //         Math.abs(Number(labelValue)) >= 1.0e6
        //             ? Math.abs(Number(labelValue)) / 1.0e6 + "M"
        //             : // Three Zeroes for Thousands
        //             Math.abs(Number(labelValue)) >= 1.0e3
        //                 ? Math.abs(Number(labelValue)) / 1.0e3 + "K"
        //                 : Math.abs(Number(labelValue));
        // }
        // var ofs = 0, pag = 100;

        // function update_offset() {
        //     var totFilteredRecs = ndx.groupAll().value();
        //     pag = totFilteredRecs
        //     var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
        //     if (ofs == undefined || pag == undefined) {
        //         ofs = 0;
        //         pag = totFilteredRecs;
        //     }
        //     ofs = ofs >= totFilteredRecs ? Math.floor((totFilteredRecs - 1) / pag) * pag : ofs;
        //     ofs = ofs < 0 ? 0 : ofs;
        //     datatabel.beginSlice(ofs);
        //     datatabel.endSlice(ofs + pag);
        // }
        // function display() {
        //     var totFilteredRecs = ndx.groupAll().value();
        //     var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
        //     d3.select('#begin')
        //         .text(end === 0 ? ofs : ofs + 1);
        //     d3.select('#end')
        //         .text(end);
        //     d3.select('#last')
        //         .attr('disabled', ofs - pag < 0 ? 'true' : null);
        //     d3.select('#next')
        //         .attr('disabled', ofs + pag >= totFilteredRecs ? 'true' : null);
        //     d3.select('#size').text(totFilteredRecs);
        //     if (totFilteredRecs != ndx.size()) {
        //         d3.select('#totalsize').text("(filtered Total: " + ndx.size() + " )");
        //     } else {
        //         d3.select('#totalsize').text('');
        //     }
        // }
        // function next() {
        //     ofs += pag;
        //     update_offset();
        //     datatabel.redraw();
        // }
        // function last() {
        //     ofs -= pag;
        //     update_offset();
        //     datatabel.redraw();
        // }
    })

    const Chartheader = () => {
        return (
          <div
            style={{
              backgroundColor: params.Barswatch === "show" ? params.BGColor : "",
              display:
                params.Title === undefined ||
                params.Title === "" ||
                params.Title === null
                  ? "none"
                  : "block", // Set the display to "block" when the conditions are false
              marginLeft:
                params.Title === undefined ||
                params.Title === "" ||
                params.Title === null
                  ? "0"
                  : "20px", // Set marginLeft to 0 when the conditions are false
              marginTop:
                params.Title === undefined ||
                params.Title === "" ||
                params.Title === null
                  ? "0"
                  : "30px", // Set marginTop to 0 when the conditions are false
            }}
          >
            {params.Titleswatch_ && (
          <span
            style={{
              fontFamily: params.TitleFont,
              fontSize: params.TitleSize,
              color: params.TitleColor,
              marginTop: "40px",
            }}
          >
            {params.Title}
          </span>
        )}
          </div>
        );
      };
    return (
        <Grid item xs={12} sm={12} md={12} xl={4} lg={12}>
            <Grid item className="cardbox" xs={12} sm={12} md={12} xl={4} lg={12} >
                <Chartheader />
                <div style={{ backgroundColor: params.Seriesswatch === 'show' ? params.BGColor : '' }} id="Charts">
                    <div ref={div} className="boxcenter" style={{marginTop: params.Title === undefined ? '50px' : '0px'}}>
                    </div>

                    <div ref={div3} className="boxcenter" style={{marginTop: params.Title === undefined ? '50px' : '0px'}}>
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
export default BarLineChart