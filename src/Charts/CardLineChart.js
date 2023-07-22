import React, { useEffect, useState, useRef } from "react";
import * as dc from "dc";
import * as d3 from "d3";
import * as crossfilter from "crossfilter2/crossfilter";
import Grid from "@material-ui/core/Grid";

const CardLineChart = ({ Data }) => {
  const div = React.useRef(null);
  React.useEffect(() => {
    //var experiments = params.Uploaded_file;

    var ndx = crossfilter(Data),
      runDimension = ndx.dimension(function (d) {
        return d["Profit"];
      });

    var speedSumGroup = "";
    speedSumGroup = runDimension.group().reduceSum(function (d) {
      return d["Profit"];
    });

    var chart;
    chart = new dc.lineChart(div.current);

    chart
      .width(null)
      .height(null)
      .margins({ left: 0, top: 0, right: 0, bottom: 0 })
      //   .x(d3.scaleBand())
      //   .xUnits(dc.units.ordinal)
      //   .brushOn(false)
      .x(d3.scaleLinear().domain([6, 20]))
      .brushOn(true)
      .dimension(runDimension)
      .group(speedSumGroup)
      .colors("#6282b3");

    dc.renderAll();
  });

  //   const Chartheader = () => {
  //     return (
  //       <div
  //         style={{
  //           backgroundColor: params.Lineswatch === "show" ? params.BGColor : "",
  //           display:
  //             params.Titleswatch === undefined ? "none" : params.Titleswatch,
  //         }}
  //       >
  //         <span
  //           style={{
  //             fontFamily: params.TitleFont,
  //             fontSize: params.TitleSize,
  //             color: params.TitleColor,
  //           }}
  //         >
  //           {params.Title}
  //         </span>
  //       </div>
  //     );
  //   };

  return (
    <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
      <Grid
        item
        className="cardbox chartbox"
        xs={12}
        sm={12}
        md={12}
        xl={12}
        lg={12}
      >
        {/* <Chartheader /> */}
        <div>
          <div id="Charts" ref={div} className="boxcenter"></div>
        </div>
      </Grid>
    </Grid>
  );
};
export default React.memo(CardLineChart);
