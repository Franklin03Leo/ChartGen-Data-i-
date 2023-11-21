import React from "react";
import * as dc from "dc";
import * as d3 from "d3";
import * as crossfilter from "crossfilter2/crossfilter";
import Grid from "@material-ui/core/Grid";
import { legend } from "dc";

const PieChart = ({ params }) => {
  const div = React.useRef(null);
  // const div1 = React.useRef(null);

  React.useEffect(() => {
    console.time("Pie");

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

    var ndx = crossfilter(experiments),
      runDimension = ndx.dimension(function (d) {
        return d[params.XAxis];
      });
    // var speedSumGroup = ''
    // if (params.YAxis !== undefined && params.YAxis !== 'Select')
    //   speedSumGroup = runDimension.group().reduceSum(function (d) { return d[params.YAxis] });
    // else
    //   speedSumGroup = runDimension.group().reduceCount(function (d) { return d[params.XAxis] });

    let sizing = (chart) => {
      let divChart = document.querySelectorAll(".boxcenter");
      divChart = divChart[divChart.length - 1];

      let offsetHeight = divChart.offsetHeight,
        offsetWidth = divChart.offsetWidth;
      chart.width(offsetWidth).height(offsetHeight).redraw();
      chart.width(offsetWidth).height(offsetHeight).redraw();
    };
    let resizing = (chart) => (window.onresize = () => sizing(chart));

    var YKey = function (d) {
      return +d[params.YAxis];
    };
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
    var speedSumGroup = "";
    if (params.YAxis !== undefined && params.YAxis !== "Select") {
      if (params.GroupByCol === "Sum") {
        speedSumGroup = runDimension.group().reduceSum(function (d) {
          return d[params.YAxis];
        });
      } else if (params.GroupByCol === "Count") {
        speedSumGroup = runDimension.group().reduceCount(function (d) {
          return d[params.YAxis];
        });
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
      } else if (params.GroupByCol === "Minimum") {
        speedSumGroup = runDimension
          .group()
          .reduce(groupArrayAdd(YKey), groupArrayRemove(YKey), groupArrayInit);
      } else if (params.GroupByCol === "Maximum") {
        speedSumGroup = runDimension
          .group()
          .reduce(groupArrayAdd(YKey), groupArrayRemove(YKey), groupArrayInit);
      }
    } else {
      speedSumGroup = runDimension.group().reduceCount(function (d) {
        return d[params.XAxis];
      });
    }

    var fmt = d3.format("02d");
    // var table_ = ndx.dimension(function (d) {
    //   return [fmt(+d[params.XAxis]), fmt(+d[params.YAxis])];
    // });
    var fileChart, datatabel;
    if (params.Width_ !== null) {
      fileChart = new dc.pieChart(div.current);
      // datatabel = new dc.dataTable(div1.current);
    } else {
      fileChart = new dc.pieChart(div.current, "Chart");
      // datatabel = new dc.dataTable(div1.current, "Table");
    }
    fileChart
      // .width(params.Width_ === null ? null : params.Width_)
      // .height(params.Width_ === null ? null : params.Height_)
      .width(params.Width_)
      .height(params.Height_)
      // .height(null)
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
        return "";
      });

    fileChart.renderlet(function (fileChart) {
      fileChart
        .selectAll(".pie-slice.pie-label")
        .style("font-family", params.pFont)
        .style("fill", params.pColor)
        .style("font-size", params.pSize + "px")
        .style("font-family", params.LabelsFont)
        .style("fill", params.LabelsColor)
        .style("font-size", params.LabelsSize + "px")
        .each(function (d) {
          d3.select(this).text(
            params.LabelsContent === "Y"
              ? d.data?.value?.toFixed(2) || d.data?.value
              : d.data.key === "Others"
              ? d.data.others[0]
              : d.data.key
          );
        })
        .style(
          "display",
          params.Labelsswatch !== undefined ? params.Labelsswatch : "none"
        );

        if (params.Legendswatch !== "none") {
          d3.selectAll("g.dc-legend-item text")
            .style("font-family", params.LegendFont)
            .style("fill", params.LegendColor)
            .style("font-size", params.LegendSize)
            .attr("y", "12")
            .attr(
              "transform",
              "rotate(" +
                (params.LengendPosition && Number(params.LegendSize) > 12 ? 8 : 0) +")"
            );
        }else {
          d3.selectAll("g.dc-legend-item").style("display", "none");
        }
    });

    if (params.GroupByCol === "Average") {
      fileChart.valueAccessor(function (d) {
        return d.value.average;
      });
    } else if (params.GroupByCol === "Minimum") {
      fileChart.valueAccessor(minSpeed);
    } else if (params.GroupByCol === "Maximum") {
      fileChart.valueAccessor(maxSpeed);
    }
    if (params.Legendswatch !== undefined)
      fileChart.legend(
        new legend()
          .x(10)
          .y(10)
          .itemHeight(13) // set the squre broket size
          .gap(params.LengendPosition ? 30 : 5) // gab between the lagend
          .horizontal(params.LengendPosition)
          .autoItemWidth(true)
          .itemWidth(150) // Adjust the width according to your needs
        // .legendText(function (d, i) {
        //   return d.name;
        // })
      );

    if (params.Width_ !== null) dc.renderAll();
    else dc.renderAll("Chart");

    d3.select("body").on("mouseover", function () {
      d3.selectAll("g.pie-slice")
        .on("mouseover", function (d) {
          let xAxisToolTip = `<div style="
              font-size: ${params.TooltipSize}px !important; 
              padding-bottom : 10px !important;
              font-family: ${params.TooltipFont} !important;">
              <b>${params.XAxis}</b> : ${d.target.__data__.data["key"]}
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
            div2.html(`<div>${xAxisToolTip}<div>`);
          } else if (params.TooltipContent === "Y") {
            if (params.YAxis === undefined || params.YAxis === "Select") {
              div2.html(`<div>${undefindYAxisToolTip}<div>`);
            } else {
              div2.html(`<div>${yAxisToolTip}</div>`);
            }
          } else if (params.TooltipContent === "All") {
            if (params.YAxis === undefined || params.YAxis === "Select") {
              div2.html(`<div> ${xAxisToolTip} ${undefindYAxisToolTip}</div>`);
            } else {
              div2.html(`<div> ${xAxisToolTip} ${yAxisToolTip}</div>`);
            }
          }
          div2.style("left", d.pageX + "px").style("top", d.pageY - 70 + "px");
        })
        .on("mouseout", function (d) {
          div2.transition().duration(500).style("opacity", 0);
        });
    });

    function getRandomColor(obj) {
      var colors_ = [];
      var letters = "fdb0731458e2679c0a".split("");
      for (var j = 0; j <= obj; j++) {
        var color = "#";
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        colors_.push(color);
      }
      return colors_;
    }

    // last();
    // next()
    // resizing(fileChart);

    console.timeEnd("Pie");
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
      <Grid
        item
        className="cardbox chartbox"
        xs={12}
        sm={12}
        md={12}
        xl={12}
        lg={12}
      >
        <Chartheader />
        <div
          style={{
            backgroundColor: params.Pieswatch === "show" ? params.BGColor : "",
          }}
          id="Charts"
        >
          <div
            ref={div}
            className="boxcenter"
            style={{ marginTop: params.Title === undefined ? "50px" : "0px" }}
          ></div>
        </div>
      </Grid>
    </Grid>
  );
};
export default React.memo(PieChart);
