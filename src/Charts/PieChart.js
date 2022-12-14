
import React, { useEffect, useState, useRef } from "react"; //, { useEffect, useRef, useState }
import * as dc from "dc";
import * as d3 from "d3";
import * as crossfilter from "crossfilter2/crossfilter";
import Grid from '@material-ui/core/Grid';
import { legend, pieChart } from "dc";

const PieChart = ({ params }) => {
  const div = React.useRef(null);
  const div1 = React.useRef(null)

  React.useEffect(() => {
    //document.documentElement.style.setProperty('--logo-color', tooltip)
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
      })
    var speedSumGroup = ''
    if (params.YAxis !== undefined && params.YAxis !== 'Select')
      speedSumGroup = runDimension.group().reduceSum(function (d) { return d[params.YAxis] });
    else
      speedSumGroup = runDimension.group().reduceCount(function (d) { return d[params.XAxis] });

    var fmt = d3.format('02d');
    var table_ = ndx.dimension(function (d) { return [fmt(+d[params.XAxis]), fmt(+d[params.YAxis])]; });
    var fileChart = new dc.pieChart(div.current);
    var datatabel = new dc.dataTable(div1.current);
    fileChart
      .width(params.Width_)
      .height(params.Heigth_)
      .slicesCap(params.SlicesCap)
      .innerRadius(params.Innerradius)
      //.radius(130)
      .minAngleForLabel(0)
      .externalLabels(30)
      .externalRadiusPadding(params.ExternalRadiusPadding)
      .colors(d3.scaleOrdinal(getRandomColor(params.SlicesCap)))
      .dimension(runDimension)
      .group(speedSumGroup)
      .title(function (y) {
        var tooltip = params.XAxis + ': ' + y.key + '\n'
          + params.YAxis + ': ' + y.value

        return ''
      })
      .renderlet(function (fileChart) {
        fileChart.selectAll(".pie-slice.pie-label")
          .style("font-family", params.pFont)
          .style("fill", params.pColor)
          .style("font-size", params.pSize + "px")
      })
    if (params.Legendswatch !== undefined)
      fileChart.legend(new legend().x(10).y(10).itemHeight(13).gap(5).horizontal(params.LengendPosition).legendText(function (d, i) { return d.name; }))


    datatabel
      .width(300)
      .height(480)
      .dimension(table_)
      .size(Infinity)
      .showSections(false)
      .columns(params.XAxis_.map((e) => e.split(' ').slice(1, 3).join(' ')))
      .sortBy(function (d) { return [fmt(+d.Expt), fmt(+d.Run)]; })
      .order(d3.ascending)

      .on('preRender', update_offset)
      .on('preRedraw', update_offset)
      .on('pretransition', display)



    dc.renderAll();
    d3.selectAll("g.dc-legend-item text")
      // .style
      .style("font-family", params.LegendFont)
      .style("fill", params.LegendColor)
      .style("font-size", params.LegendSize)

    d3.selectAll(".dc-legend")
      .style("display", params.Legendswatch === undefined ? 'none' : params.Legendswatch)


    d3.select('body').on('mouseover', function () {

      d3.selectAll('g.pie-slice')
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
            div2.html('<div><div><b>' + params.XAxis + '</b> : ' + d.target.__data__.data['key'] + '</div><div>')
          }
          else if (params.TooltipContent === 'Y') {
            if (params.YAxis === undefined || params.YAxis === 'Select') {
              div2.html('<div><div><b>Count</b> : ' + d.target.__data__.data['value'] + '</div><div>')
            }
            else {
              div2.html('<div><div><b>' + params.YAxis + '</b> : ' + d.target.__data__.data['value'].toFixed(2) + '</div><div>')
            }
          }
          else if (params.TooltipContent === 'All') {
            if (params.YAxis === undefined || params.YAxis === 'Select') {
              div2.html('<div><div><b>'
                + params.XAxis + '</b> : ' + d.target.__data__.data['key'] + '</div><div><b>'
                + 'Count </b> : ' + d.target.__data__.data['value'] + '</div></div>')
            }
            else {
              div2.html('<div><div><b>'
                + params.XAxis + '</b> : ' + d.target.__data__.data['key'] + '</div><div><b>'
                + params.YAxis + '</b> : ' + d.target.__data__.data['value'].toFixed(2) + '</div></div>')
            }
          }
          div2.style("left", (d.pageX) + "px")
            .style("top", (d.pageY - 70) + "px");
        })
        .on("mouseout", function (d) {
          div2.transition()
            .duration(500)
            .style("opacity", 0);
        });

    });

    function getRandomColor(obj) {
      var colors_ = []
      var letters = 'fdb0731458e2679c0a'.split('');
      for (var j = 0; j <= obj; j++) {
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        colors_.push(color);

      }
      return colors_;

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

    // last();
    // next()

  })

  const Chartheader = () => {
    return (
      <div style={{ backgroundColor: params.Pieswatch === 'show' ? params.BGColor : '', display: params.Titleswatch === undefined ? 'none' : params.Titleswatch }}>
        <span style={{ fontFamily: params.TitleFont, fontSize: params.TitleSize, color: params.TitleColor }}>{params.Title}</span>
      </div>
    );
  };

  return (
    <Grid item xs={12} sm={12} md={12} xl={4} lg={12}>
      <Grid item className="cardbox">
        <Chartheader />
        <div style={{ backgroundColor: params.Pieswatch === 'show' ? params.BGColor : '' }}>
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
export default PieChart;