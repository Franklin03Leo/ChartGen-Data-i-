import React, { useEffect, useState, useRef } from "react"; //, { useEffect, useRef, useState }
import * as dc from "dc";
import * as crossfilter from "crossfilter2/crossfilter";
import Grid from "@material-ui/core/Grid";
import * as d3module from "d3";
import "../Styles/dc.css";
import { legend, pluck } from "dc";
const d3 = {
  ...d3module,
};

const BarChart = ({ params }) => {
  console.log("Bar chart =====>", params);
  const [isString, setString] = React.useState(false);
  const div = React.useRef(null);

  const IsString_ = (obj) => {
    for (let x in obj) {
      if (isNaN(obj[x]) == true) {
        setString(true);
      }
    }
  };

  React.useEffect(() => {
    console.time("bar");
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

    IsString_(params.Uploaded_file[0]);
    var ndx, datatabel, chart;
    var experiments = {};
    if (params?.filteApply === "FilterApply") {
      experiments = params.Uploaded_fileTemp;
    } else {
      experiments = params.Uploaded_file;
    }

    experiments.sort((x, y) => d3.ascending(x[params.XAxis], y[params.XAxis]));

    const fnLimit = (data, dimensions) => {
      const filteredData = data.filter((item) =>
        dimensions.includes(item[params.XAxis])
      );
      return filteredData;
    };

    if (params.Ascending === undefined && params.Descending === undefined) {
      let unique = [...new Set(experiments.map((item) => item[params.XAxis]))];
      if (params.limit === "select") unique = unique.slice();
      else unique = unique.slice(0, params.limit);
      const finalVal = fnLimit(experiments, unique);
      experiments = finalVal;
      params.Sortby = unique;
    }

    if (params.Ascending) {
      params["SortbyY"] = undefined;
      experiments.sort((x, y) =>
        d3.ascending(x[params.XAxis], y[params.XAxis])
      );
      updateTemplateAndRender(experiments, "X");
    }
    if (params.Descending) {
      // experiments = params.Uploaded_file.slice(
      //   params.Uploaded_file?.length - params?.limit || 0,
      //   params.Uploaded_file?.length
      // );
      params["SortbyY"] = undefined;
      // experiments.SortbyY = true;
      experiments.sort((x, y) =>
        d3.descending(x[params.XAxis], y[params.XAxis])
      );

      updateTemplateAndRender(experiments, "X");
    }

    if (params.AscendingY) {
      updateTemplateAndRender(experiments, "YA");
    }
    if (params.DescendingY) {
      updateTemplateAndRender(experiments, "YD");
    }

    function updateTemplateAndRender(sortedData, Type) {
      if (Type === "X") {
        let unique = [...new Set(sortedData.map((item) => item[params.XAxis]))];
        params.Sortby = unique;
        params.SortbyY = undefined;
        if (params.limit !== "select") {
          unique = unique.slice(0, params.limit);
          let finalVal = fnLimit(sortedData, unique);
          experiments = finalVal;
          params.Sortby = unique;
        }
      } else {
        //Descending order based on Y-axis
        params.Sortby = [];
        if (Type === "YA") params.SortbyY = true;
        else {
          params.SortbyY = false;
        }
      }
    }

    if (params.Width_ !== null) {
      chart = new dc.barChart(div.current);
    } else {
      chart = new dc.barChart(div.current, "Barchart");
    }
    chart.title(function (y) {
      var tooltip =
        params.XAxis + ": " + y.key + "\n" + params.YAxis + ": " + y.value;
      return "";
    });
    const Max = experiments.map((object) => {
      return object[params.XAxis];
    });

    ndx = crossfilter(experiments);

    var runDimension = ndx.dimension(function (d) {
      return d[params.XAxis];
    });

    var YKey = function (d) {
      return +d[params.YAxis];
    };
    let sizing = (chart) => {
      let divChart = document.querySelectorAll(".boxcenter");
      divChart = divChart[divChart.length - 1];
      let offsetHeight = divChart.offsetHeight,
        offsetWidth = divChart.offsetWidth;
      // chart.width(offsetWidth).height(offsetHeight).redraw();
      chart.width(offsetWidth).height(offsetHeight).redraw();
    };
    let resizing = (chart) => (window.onresize = () => sizing(chart));
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
        // Assuming you have set up a dimension-based group (speedSumGroup)
        speedSumGroup = runDimension.group().reduceSum(function (d) {
          return d[params.YAxis];
        });
      } else if (params.GroupByCol === "Count") {
        // Create a group for your dimension
        var speedSumGroup = runDimension.group().reduceCount(function (d) {
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

      var sortedGroups = speedSumGroup.all().sort(function (a, b) {
        if (params.AscendingY) return a.value - b.value;
        // Sort in ascending order
        else return b.value - a.value;
      });

      // To set the bar limit
      var barLimit = sortedGroups.slice(
        0,
        parseInt(params.limit == "select" ? 0 : params.limit)
      );

      // Create a new group with the limited group
      var customGroup = {
        all: function () {
          return barLimit;
        },
      };
    } else {
      speedSumGroup = runDimension.group().reduceCount(function (d) {
        return d[params.XAxis];
      });
    }
    var fmt = d3.format("02d");
    var table_ = ndx.dimension(function (d) {
      return [fmt(+d[params.XAxis]), fmt(+d[params.YAxis])];
    });

    let PadTop,
      PadRight,
      PadBottom,
      PadLeft = 0;
    if (params.PadTop === undefined || params.PadTop === "") PadTop = 0;
    else PadTop = params.PadTop;
    if (params.PadRight === undefined || params.PadRight === "") PadRight = 0;
    else PadRight = params.PadRight;
    if (params.PadBottom === undefined || params.PadBottom === "")
      PadBottom = 0;
    else PadBottom = params.PadBottom;
    if (params.PadLeft === undefined || params.PadLeft === "") PadLeft = 0;
    else PadLeft = params.PadLeft;

    chart
      .ordinalColors([params.Barswatch === "show" ? params.Color : "#6282b3"])
      .margins({
        top: 10 + parseInt(PadTop),
        right: 20 + parseInt(PadRight),
        bottom: 50 + parseInt(PadBottom),
        left: 40 + parseInt(PadLeft),
      })
      .width(params.Width_ === null ? null : params.Width_)
      .height(params.Height_);
    if (isString === true) {
      chart
        .x(
          d3
            .scaleLinear()
            .domain([Math.min(...Max), Math.max(...Max) + Math.min(...Max)])
        )
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal);
    } else {
      chart
        .xUnits(dc.units.ordinal)
        .x(d3.scaleBand().domain(params["Sortby"] || []));
    }
    chart
      .brushOn(false)
      .barPadding(0.4)
      .outerPadding(0.2)
      .ordinalColors([params.Barswatch === "show" ? params.Color : "#6282b3"])
      .yAxisPadding(params.YAxisPadding);
    try {
      chart.group(
        params.limit !== undefined && params.limit !== "select"
          ? customGroup
          : speedSumGroup
      );
    } catch (error) {
      chart.group(speedSumGroup);
    }
    chart.dimension(runDimension).elasticY(true);
    if (params.SortbyY !== undefined) {
      chart.ordering(function (d) {
        return params.SortbyY ? d.value : -d.value;
      });
    }
    chart.yAxisLabel(params.YAxisLabel).xAxisLabel(params.XAxisLabel);

    if (params.Labelsswatch !== undefined)
      chart.renderLabel(true).label(function (d) {
        if (params.LabelsContent === "X") return d.x;
        else if (params.LabelsContent === "Y") return d.y.toFixed(2);
        else if (params.LabelsContent === "Title") return params.YAxis;
      });

    if (params.GroupByCol === "Average") {
      chart.valueAccessor(function (d) {
        return d.value.average;
      });
    } else if (params.GroupByCol === "Minimum") {
      chart.valueAccessor(minSpeed);
    } else if (params.GroupByCol === "Maximum") {
      chart.valueAccessor(maxSpeed);
    }
    chart.yAxis().tickFormat(function (v) {
      return BMK(v);
    });

    // Render the chart
    // chart.render();

    d3.select("body").on("mouseover", function () {
      d3.selectAll("rect.bar")
        .on("mouseover", function (d) {
          if (params.Tooltipswatch_) {
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
                  d.target.__data__.x +
                  "</div><div>"
              );
            } else if (params.TooltipContent === "Y") {
              if (params.YAxis === undefined || params.YAxis === "Select") {
                div2.html(
                  "<div><div><b>" +
                    "Count </b> : " +
                    parseFloat(d.target.__data__.y).toFixed(2) +
                    "</div><div>"
                );
              } else {
                div2.html(
                  "<div><div><b>" +
                    params.YAxis +
                    "</b> : " +
                    parseFloat(d.target.__data__.y).toFixed(2) +
                    "</div><div>"
                );
              }
            } else if (params.TooltipContent === "All") {
              if (params.YAxis === undefined || params.YAxis === "Select") {
                div2.html(
                  "<div><div><b>" +
                    params.XAxis +
                    "</b> : " +
                    d.target.__data__.x +
                    "</div><div><b>" +
                    "Count </b> : " +
                    parseFloat(d.target.__data__.y).toFixed(2) +
                    "</div></div>"
                );
              } else {
                div2.html(
                  "<div><div><b>" +
                    params.XAxis +
                    "</b> : " +
                    d.target.__data__.x +
                    "</div><div><b>" +
                    params.YAxis +
                    "</b> : " +
                    parseFloat(d.target.__data__.y).toFixed(2) +
                    "</div></div>"
                );
              }
            }
            div2
              .style("left", d.pageX + "px")
              .style("top", d.pageY - 50 + "px");
          }
        })
        .on("mouseout", function (d) {
          div2.transition().duration(500).style("opacity", 0);
        });
    });

    chart.renderlet(function (chart) {
      //X-Axis
      chart
        .selectAll("g.x g.tick text")
        .attr(
          "dx",
          params.Rotate === undefined || params.Rotate === "" ? "" : "-10"
        )
        .attr(
          "text-anchor",
          params.Rotate === undefined || params.Rotate === "" ? "" : "end"
        )
        .attr(
          "transform",
          `rotate(${
            params.Rotate === undefined || params.Rotate === ""
              ? "0"
              : params.Rotate
          })`
        )
        .style("font-family", params.xFont)
        .style("color", params.xColor)
        .style("font-size", params.xSize + "px");

      //y-Axis
      chart
        .selectAll("g.y g.tick text")
        .attr("dx", "-10")
        .attr("text-anchor", "end")
        // .attr('transform', `rotate(${params.Rotate})`)
        .style("font-family", params.yFont)
        .style("color", params.yColor)
        .style("font-size", params.ySize + "px");

      //X-Axis Label
      chart
        .selectAll(".x-axis-label")
        .style("font-family", params.xlFont)
        .style("fill", params.xlColor)
        .style("font-size", params.xlSize + "px")
        .style(
          "display",
          params.Axesswatch !== undefined ? params.Axesswatch : "none"
        );

      //Y-Axis Label
      chart
        .selectAll(".y-axis-label")
        .style("font-family", params.ylFont)
        .style("fill", params.ylColor)
        .style("font-size", params.ylSize + "px")
        .style(
          "display",
          params.Axesswatch !== undefined ? params.Axesswatch : "none"
        );

      chart
        .selectAll(".barLabel")
        .style("font-family", params.LabelsFont)
        .style("fill", params.LabelsColor)
        .style("font-size", params.LabelsSize + "px")
        .style(
          "display",
          params.Labelsswatch !== undefined ? params.Labelsswatch : "none"
        );
    });

    if (params.Width_ !== null) dc.renderAll();
    else dc.renderAll("Barchart");

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
    // resizing(chart);  Commit by Lokesh
    console.timeEnd("bar");
  }, [params]);

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
    <Grid item xs={12} md={12} xl={12} lg={12}>
      <Grid
        item
        className="cardbox"
        style={{ padding: "0px 10px", border: "2px solid #D3D3D3" }}
      >
        <Chartheader />
        <div
          style={{
            backgroundColor: params.Barswatch === "show" ? params.BGColor : "",
          }}
          id="Charts"
        >
          <div
            ref={div}
            className="boxcenter"
            style={{ marginTop: params.Title === undefined ? "50px" : "none" }}
          ></div>
        </div>
      </Grid>
    </Grid>
  );
};

export default React.memo(BarChart);
