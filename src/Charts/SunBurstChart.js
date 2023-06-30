import React from "react";
import * as dc from "dc";
import * as d3 from "d3";
import * as crossfilter from "crossfilter2/crossfilter";
import Grid from "@material-ui/core/Grid";
import { legend } from "dc";

const SunBurstChart = ({ params }) => {
  console.log("sunburst chart is rendering .....");
  const div = React.useRef(null);
  const div1 = React.useRef(null);
  React.useEffect(() => {
    var div2 = d3
      .select("#Charts")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("font-family", params.TooltipFont)
      .style("color", params.TooltipColor)
      .style("font-size", params.TooltipSize + "px")
      .style("background-color", params.TooltipBGColor)
      .style(
        "border",
        params.TooltipThickness + "px " + params.TooltipTickColor + " solid"
      );
    var experiments = params.Uploaded_file;
    let XAxis = params.OrderedList.map((e) => {
      return e.split(" ").slice(1, 20).join(" ");
    });
    var ndx = crossfilter(experiments),
      runDimension = ndx.dimension(function (d) {
        if (XAxis.length === 3) return [d[XAxis[0]], d[XAxis[1]], d[XAxis[2]]];
        else if (XAxis.length === 2) return [d[XAxis[0]], d[XAxis[1]]];
        else if (XAxis.length === 1) return [d[XAxis[0]]];
      });

    var speedSumGroup = runDimension.group().reduceSum(function (d) {
      return d[params.YAxis];
    });

    var fmt = d3.format("02d");
    var table_ = ndx.dimension(function (d) {
      return [fmt(+d[params.XAxis]), fmt(+d[params.YAxis])];
    });
    var SunBurst, datatabel;
    if (params.Width_ !== null) {
      SunBurst = new dc.sunburstChart(div.current);
      datatabel = new dc.dataTable(div1.current);
    } else {
      SunBurst = new dc.sunburstChart(div.current, "Chart");
      datatabel = new dc.dataTable(div1.current, "Table");
    }
    SunBurst.width(params.Width_)
      .height(null)
      .innerRadius(params.Innerradius)
      .dimension(runDimension)
      .group(speedSumGroup)
      .title(function (y) {
        return "";
      });
    if (params.Legendswatch !== undefined) {
      SunBurst.legend(
        new legend()
          .x(10)
          .y(10)
          .itemHeight(13)
          .gap(5)
          .horizontal(params.LengendPosition)
          .legendText(function (d, i) {
            debugger;
            return d.name[0];
          })
      );
    }
    datatabel
      .width(300)
      .height(480)
      .dimension(table_)
      .size(Infinity)
      .showSections(false)
      .columns(
        params.GroupByCopy_.map((e) => e.split(" ").slice(1, 30).join(" "))
      )
      //.sortBy(function (d) { return [fmt(+d.Expt), fmt(+d.Run)]; })
      .order(d3.ascending)

      .on("preRender", update_offset)
      .on("preRedraw", update_offset)
      .on("pretransition", display);
    if (params.Width_ !== null) dc.renderAll();
    else dc.renderAll("Chart");

    d3.selectAll("text.pie-slice").style("display", "none");

    d3.select("body").on("mouseover", function () {
      d3.selectAll("g.pie-slice")
        .on("mouseover", function (d) {
          div2
            .transition()
            .duration(500)
            .style("opacity", params.Tooltipswatch)
            .style("font-family", params.TooltipFont)
            .style("color", params.TooltipColor)
            .style("font-size", params.TooltipSize + "px")
            .style("background-color", params.TooltipBGColor)
            .style(
              "border",
              params.TooltipThickness +
                "px " +
                params.TooltipTickColor +
                " solid"
            );
          if (params.TooltipContent === "X") {
            div2.html(
              "<div><div><b>" +
                params.XAxis +
                "</b> : " +
                d.target.__data__.data["key"] +
                "</div><div>"
            );
          } else if (params.TooltipContent === "Y") {
            if (params.YAxis === undefined || params.YAxis === "Select") {
              div2.html(
                "<div><div><b>Count</b> : " +
                  parseFloat(d.target.__data__.value).toFixed(2) +
                  "</div><div>"
              );
            } else {
              div2.html(
                "<div><div><b>" +
                  params.YAxis +
                  "</b> : " +
                  parseFloat(d.target.__data__.value).toFixed(2) +
                  "</div><div>"
              );
            }
          } else if (params.TooltipContent === "All") {
            if (params.YAxis === undefined || params.YAxis === "Select") {
              div2.html(
                "<div><div><b>" +
                  params.XAxis +
                  "</b> : " +
                  d.target.__data__.data["key"] +
                  "</div><div><b>" +
                  "Count </b> : " +
                  parseFloat(d.target.__data__.value).toFixed(2) +
                  "</div></div>"
              );
            } else {
              div2.html(
                "<div><div><b>" +
                  XAxis[d.target.__data__.depth - 1] +
                  "</b> : " +
                  d.target.__data__.data["key"] +
                  "</div><div><b>" +
                  params.YAxis +
                  "</b> : " +
                  parseFloat(d.target.__data__.value).toFixed(2) +
                  "</div></div>"
              );
            }
          }
          div2.style("left", d.pageX + "px").style("top", d.pageY - 70 + "px");
        })
        .on("mouseout", function (d) {
          div2.transition().duration(500).style("opacity", 0);
        });
    });

    var ofs = 0,
      pag = 100;
    function update_offset() {
      var totFilteredRecs = ndx.groupAll().value();
      var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
      if (ofs == undefined || pag == undefined) {
        ofs = 0;
        pag = totFilteredRecs;
      }
      ofs =
        ofs >= totFilteredRecs
          ? Math.floor((totFilteredRecs - 1) / pag) * pag
          : ofs;
      ofs = ofs < 0 ? 0 : ofs;
      datatabel.beginSlice(ofs);
      datatabel.endSlice(ofs + pag);
    }
    function display() {
      var totFilteredRecs = ndx.groupAll().value();
      var end = ofs + pag > totFilteredRecs ? totFilteredRecs : ofs + pag;
      d3.select("#begin").text(end === 0 ? ofs : ofs + 1);
      d3.select("#end").text(end);
      d3.select("#last").attr("disabled", ofs - pag < 0 ? "true" : null);
      d3.select("#next").attr(
        "disabled",
        ofs + pag >= totFilteredRecs ? "true" : null
      );
      d3.select("#size").text(totFilteredRecs);
      if (totFilteredRecs != ndx.size()) {
        d3.select("#totalsize").text("(filtered Total: " + ndx.size() + " )");
      } else {
        d3.select("#totalsize").text("");
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
  });

  const Chartheader = () => {
    return (
      <div
        style={{
          backgroundColor: params.Pieswatch === "show" ? params.BGColor : "",
          display:
            params.Titleswatch === undefined ? "none" : params.Titleswatch,
        }}
      >
        <span
          style={{
            fontFamily: params.TitleFont,
            fontSize: params.TitleSize,
            color: params.TitleColor,
          }}
        >
          {params.Title}
        </span>
      </div>
    );
  };

  return (
    <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
      <Grid item className="cardbox chartbox">
        <Chartheader />
        <div
          style={{
            backgroundColor: params.Pieswatch === "show" ? params.BGColor : "",
          }}
        >
          <div
            id="Charts"
            // style={{ height: "50vh" }}
            ref={div}
            className="boxcenter"
          ></div>
        </div>
      </Grid>
      <Grid
        item
        className="cardbox chartbox"
        style={{ display: params.Width_ === null ? "none" : "block" }}
      >
        <div id="table-scroll" className="table-scroll">
          <div className="table-wrap">
            <table ref={div1} className="main-table"></table>
          </div>
          <div id="paging" style={{ float: "right" }}>
            Showing <span id="begin"></span>-<span id="end"></span> of{" "}
            <span id="size"></span>{" "}
            <span id="totalsize" style={{ display: "none" }}></span>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default React.memo(SunBurstChart);
