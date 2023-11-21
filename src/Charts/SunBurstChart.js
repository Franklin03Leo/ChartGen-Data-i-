import React from "react";
import * as dc from "dc";
import * as d3 from "d3";
import * as crossfilter from "crossfilter2/crossfilter";
import Grid from "@material-ui/core/Grid";
import { legend } from "dc";

const SunBurstChart = ({ params }) => {
  const div = React.useRef(null);
  React.useEffect(() => {
    var div2 = d3
      .selectAll(".boxcenter")
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
    // var experiments = params.Uploaded_file;
    var experiments = {};
    if (params?.filteApply === "FilterApply") {
      experiments = params.Uploaded_fileTemp;
    } else {
      experiments = params.Uploaded_file;
    }
    let XAxis = params.OrderedList.map((e) => {
      return e.split(" ").slice(1, 20).join(" ");
    });
    var ndx = crossfilter(experiments),
      runDimension = ndx.dimension(function (d) {
        // if (XAxis.length === 4) return [d[XAxis[0]], d[XAxis[1]], d[XAxis[2]], d[XAxis[3]]];
        // else if (XAxis.length === 3) return [d[XAxis[0]], d[XAxis[1]], d[XAxis[2]]];
        // else if (XAxis.length === 2) return [d[XAxis[0]], d[XAxis[1]]];
        // else if (XAxis.length === 1) return [d[XAxis[0]]];

        var dimensionArray = [];
        for (var i = 0; i < XAxis.length; i++) {
          dimensionArray.push(d[XAxis[i]]);
        }
        return dimensionArray;
      });

    var YKey = function (d) {
      return +d[params.YAxis];
    };

    let speedSumGroup = "";

    if (params.GroupByCol === "Sum") {
      speedSumGroup = runDimension.group().reduceSum((d) => {
        return d[params.YAxis];
      });
    } else if (params.GroupByCol === "Count") {
      speedSumGroup = runDimension.group().reduceCount(function (d) {
        return d[params.YAxis];
      });
    } else if (params.GroupByCol === "Minimum") {
      speedSumGroup = runDimension
        .group()
        .reduce(groupArrayAdd(YKey), groupArrayRemove(YKey), groupArrayInit);
    } else if (params.GroupByCol === "Maximum") {
      speedSumGroup = runDimension
        .group()
        .reduce(groupArrayAdd(YKey), groupArrayRemove(YKey), groupArrayInit);
    } else if (params.GroupByCol === "Average") {
      speedSumGroup = runDimension.group().reduce(
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
            average: 0,
          };
        }
      );
    }

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
        if (keyfn(elements[pos]) === keyfn(item)) elements.splice(pos, 1);
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

    var fmt = d3.format("02d");
    var table_ = ndx.dimension(function (d) {
      return [fmt(+d[params.XAxis]), fmt(+d[params.YAxis])];
    });
    var SunBurst;
    if (params.Width_ !== null) {
      SunBurst = new dc.sunburstChart(div.current);
      // datatabel = new dc.dataTable(div1.current);
    } else {
      SunBurst = new dc.sunburstChart(div.current, "Chart");
      // datatabel = new dc.dataTable(div1.current, "Table");
    }
    SunBurst.width(params.Width_)
      // .height(params.Width_ === null ? null : params.Height_)
      .height(params.Height_)
      .innerRadius(params.Innerradius)
      .dimension(runDimension)
      .group(speedSumGroup)
      .title(function (y) {
        return params.LabelsContent === "Y" ? y.value : y.key;
      })
      .label((d) => {
        return params.LabelsContent === "Y" ? d.value : d.key;
        // return d.parent.data.children[i++]?.key || "";
      });

    if (params.Legendswatch !== undefined && params.Legendswatch_ !== false) {
      SunBurst.legend(
        new legend()
          .x(10)
          .y(10)
          .itemHeight(13)
          .gap(params.LengendPosition ? 30 : 5) // gab between the lagend
          .autoItemWidth(true)
          .horizontal(params.LengendPosition)
        // .legendText(function (d, i) {
        //   return d.name[0];
        // })
      );
    }

    if (params.GroupByCol === "Average") {
      SunBurst.valueAccessor(function (d) {
        return d.value.average;
      });
    } else if (params.GroupByCol === "Minimum") {
      SunBurst.valueAccessor(minSpeed);
    } else if (params.GroupByCol === "Maximum") {
      SunBurst.valueAccessor(maxSpeed);
    }

    // if (params.Labelsswatch !== undefined)
    //   SunBurst.renderLabel(true).label(function (d) {
    //     if (params.LabelsContent === "X") return d.key;
    //     else if (params.LabelsContent === "Y") return d.value.toFixed(2);
    //   });

    if (params.Width_ !== null) dc.renderAll();
    else dc.renderAll("Chart");

    d3.selectAll("text.pie-slice").style("display", "none");

    d3.selectAll("g.dc-legend-item text")
      .style("font-family", params.LegendFont)
      .style("fill", params.LegendColor)
      .style("font-size", params.LegendSize)
      .attr("y", "12")
      .attr(
        "transform",
        "rotate(" +
          (params.LengendPosition && Number(params.LegendSize) > 12 ? 8 : 0) +
          ")"
      );

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

          let xAxisToolTip = `<div style="
              font-size: ${params.TooltipSize}px !important; 
              padding-bottom : 10px !important;
              font-family: ${params.TooltipFont} !important;">
              <b>${XAxis[d.target.__data__.depth - 1]}</b> : ${
            d.target.__data__.data["key"]
          }
            </div>`;

          let yAxisToolTip = `<div style="
              font-size: ${params.TooltipSize}px !important; 
              font-family: ${params.TooltipFont} !important;">
              <b>${params.YAxis}</b> : ${parseFloat(
            d.target.__data__.value
          ).toFixed(2)}
            </div>`;

          let undefindYAxisToolTip = `<div style="
              font-size: ${params.TooltipSize}px !important; 
              font-family: ${params.TooltipFont} !important;">
              <b> Count</b> : ${parseFloat(d.target.__data__.value).toFixed(2)}
            </div>`;

          if (params.TooltipContent === "X") {
            div2.html(`<div>${xAxisToolTip}  </div>`);
          } else if (params.TooltipContent === "Y") {
            if (params.YAxis === undefined || params.YAxis === "Select") {
              div2.html(`<div>${undefindYAxisToolTip} </div>`);
            } else {
              div2.html(`<div>${yAxisToolTip} </div>`);
            }
          } else if (params.TooltipContent === "All") {
            if (params.YAxis === undefined || params.YAxis === "Select") {
              div2.html(`<div>${xAxisToolTip} ${undefindYAxisToolTip} </div>`);
            } else {
              div2.html(`<div>${xAxisToolTip} ${yAxisToolTip} </div>`);
            }
          }
          div2.style("left", d.pageX + "px").style("top", d.pageY - 70 + "px");
        })
        .on("mouseout", function (d) {
          div2.transition().duration(500).style("opacity", 0);
        });
    });

    let sizing = (chart) => {
      let divChart = document.querySelectorAll(".boxcenter");
      divChart = divChart[divChart.length - 1];

      let offsetHeight = divChart.offsetHeight,
        offsetWidth = divChart.offsetWidth;
      chart.width(offsetWidth).height(offsetHeight).redraw();
      chart.width(offsetWidth).height(offsetHeight).redraw();
    };
    let resizing = (chart) => (window.onresize = () => sizing(chart));

    // resizing(SunBurst);
  });

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
    <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
      <Grid item className="cardbox chartbox">
        <Chartheader />
        <div
          style={{
            backgroundColor: params.Pieswatch === "show" ? params.BGColor : "",
          }}
          id="Charts"
        >
          <div
            // style={{ height: "50vh" }}
            ref={div}
            className="boxcenter"
            style={{
              marginTop: params.Title === undefined ? "50px" : "0px",
            }}
          ></div>
        </div>
      </Grid>
    </Grid>
  );
};

export default React.memo(SunBurstChart);
