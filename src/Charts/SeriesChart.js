import React from "react";
import * as dc from "dc";
import * as d3 from "d3";
import * as crossfilter from "crossfilter2/crossfilter";
import Grid from "@material-ui/core/Grid";
const SeriesChart = ({ params }) => {
  const div = React.useRef(null);
  // const div1 = React.useRef(null);

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
    var originalObject = {};
    if (params?.filteApply === "FilterApply") {
      originalObject = params.Uploaded_fileTemp;
    } else {
      originalObject = params.Uploaded_file;
    }

    var experiments = JSON.stringify(originalObject);

    // const timeFormat = d3.timeFormat("%Y-%m-%d");
    const timeFormat_ = d3.timeFormat("%m-%d-%Y");
    experiments = JSON.parse(experiments);
    experiments.forEach(function (x) {
      if (new Date(x[params.XAxis]) == "Invalid Date")
        // x[params.XAxis] = new Date(
        //   x[params.XAxis].toString().split("-").reverse().join("/")
        // );
        x[params.XAxis] = new Date(
          x[params.XAxis]?.toString().split("-").reverse().join("/") || ""
        );
      else x[params.XAxis] = new Date(x[params.XAxis]);
    });
    var ndx = crossfilter(experiments),
      runDimension = ndx.dimension(function (d) {
        return [d[params.GroupBy], d[params.XAxis]];
      });

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

    let sizing = (chart) => {
      let divChart = document.querySelectorAll(".boxcenter");
      divChart = divChart[divChart.length - 1];
      let offsetHeight = divChart.offsetHeight,
        offsetWidth = divChart.offsetWidth;
      chart.width(offsetWidth).height(offsetHeight).redraw();
    };
    let resizing = (chart) => (window.onresize = () => sizing(chart));

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

    var runDimension_ = ndx.dimension(function (d) {
      return d[params.XAxis];
    });
    var speedSumGroup_ = runDimension_.group().reduceSum(function (d) {
      return parseInt(d[params.YAxis]);
    });

    var minDate = d3.min(experiments, function (d) {
      return d[params.XAxis];
    });
    var maxDate = d3.max(experiments, function (d) {
      return d[params.XAxis];
    });
    var YminDate = d3.min(experiments, function (d) {
      return d[params.YAxis];
    });
    var YmaxDate = d3.max(experiments, function (d) {
      return d[params.YAxis];
    });

    function static_copy_group(group) {
      var all = group.all().map((kv) => ({ key: kv.key, value: kv.value }));
      return {
        all: function () {
          return all;
        },
      };
    }

    var speedSumGroup_copy = static_copy_group(speedSumGroup_);
    var fmt = d3.format("02d");
    // var table_ = ndx.dimension(function (d) {
    //   // set the changed date format
    //   d[params.XAxis] = `${d[params.XAxis]
    //     .getDate()
    //     .toString()
    //     .padStart(2, "0")}-${(d[params.XAxis].getMonth() + 1)
    //     .toString()
    //     .padStart(2, "0")}-${d[params.XAxis].getFullYear()}`;
    //   return [fmt(+d[params.XAxis])]; // (Date.now() - new Date(d.DOB)) / 31557600000;
    //   // return [fmt(+d[params.XAxis])];
    // });

    var chart = new dc.seriesChart(div.current);
    // var datatabel = new dc.dataTable(div1.current);
    //  const volumeChart = new dc.barChart(div3.current);
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
      .width(params.Width_)
      .height(params.Height_)
      // .height(null)
      .margins({
        top: parseInt(10) + parseInt(PadTop),
        right: parseInt(30) + parseInt(PadRight),
        bottom: parseInt(50) + parseInt(PadBottom),
        left: parseInt(30) + parseInt(PadLeft),
      })
      .chart(function (c) {
        return new dc.lineChart(c)
          .curve(d3.curveCardinal)
          .evadeDomainFilter(true);
      })
      .x(d3.scaleTime().domain([minDate, maxDate]))
      // .y(d3.scaleLinear().domain([100, 1000]))
      .y(d3.scaleLinear().domain([YminDate, YmaxDate]))

      .round(d3.timeMonth.round)
      .xUnits(d3.timeMonths)
      .brushOn(false)
      .elasticY(true)
      .transitionDuration(1000)
      .dimension(runDimension)
      .group(speedSumGroup)
      .mouseZoomable(false) // remove zoom action
      //  .rangeChart(volumeChart)
      .seriesAccessor(function (d) {
        return d.key[0];
      })
      .keyAccessor(function (d) {
        return d.key[1];
      })
      .valueAccessor(function (d) {
        return +d.value;
      })
      .colors(d3.scaleOrdinal(getRandomColor(params.SlicesCap)))
      // .colors(d3.scaleOrdinal(getRandomColor([params.GroupBy].length)))

      .renderLabel(true)
      .label(function (d) {
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
    if (params.Legendswatch !== undefined)
      chart.legend(
        dc
          .legend()
          .x(0)
          .y(5)
          .itemHeight(13)
          .gap(5)
          .horizontal(params.LengendPosition)
      );
    chart
      .title(function (y) {
        var tooltip =
          params.XAxis + ": " + y.key + "\n" + params.YAxis + ": " + y.value;

        return "";
      })
      //.legend(dc.legend().x(0).y(10).itemHeight(13).gap(5).horizontal(true).legendWidth(140).itemWidth(70))
      .renderlet(function (chart) {
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
          .attr("transform", `rotate(${params.Rotate})`)
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
            params.Axesswatch === undefined ? "none" : params.Axesswatch
          );

        //Y-Axis Label
        chart
          .selectAll(".y-axis-label")
          .style("font-family", params.ylFont)
          .style("fill", params.ylColor)
          .style("font-size", params.ylSize + "px")
          .style(
            "display",
            params.Axesswatch === undefined ? "none" : params.Axesswatch
          );

        chart
          .selectAll(".barLabel")
          .style("font-family", params.LabelsFont)
          .style("fill", params.LabelsColor)
          .style("font-size", params.Labelsize + "px")
          .style(
            "display",
            params.Labelsswatch !== undefined ? params.Labelsswatch : "none"
          );
      })
      .yAxisLabel(params.YAxisLabel)
      .xAxisLabel(params.XAxisLabel);
    chart.yAxis().tickFormat(function (v) {
      return BMK(v);
    });

    // volumeChart
    //     .width(params.Width_)
    //     .height(150)
    //     .margins({ top: parseInt(10) + parseInt(PadTop), right: parseInt(30) + parseInt(PadRight), bottom: parseInt(50) + parseInt(PadBottom), left: parseInt(30) + parseInt(PadLeft) })
    //     .dimension(runDimension)
    //     .group(speedSumGroup_copy)
    //     .centerBar(true)
    //     .ordinalColors([params.Seriesswatch === 'show' ? params.Color : '#6282b3'])
    //     .gap(1)
    //     .x(d3.scaleTime().domain([new Date(minDate), new Date(maxDate)]))
    //     .round(d3.timeMonth.round)
    //     .alwaysUseRounding(true)
    //     .xUnits(d3.timeMonths)
    //     .controlsUseVisibility(true)
    //     .renderlet(function (volumeChart) {
    //         volumeChart.selectAll("g.x g.tick text")
    //             .attr('dx', '-10')
    //             .attr('text-anchor', 'end')
    //             .attr('transform', "rotate(-60)")
    //     })
    // volumeChart.yAxis().tickFormat(function (v) { return BMK(v); })

    // volumeChart.xAxis().tickFormat(function (v) { return timeFormat_(v); })

    dc.renderAll();
    d3.selectAll("g.dc-legend-item text")
      .style("font-family", params.LegendFont)
      .style("fill", params.LegendColor)
      .style("font-size", params.LegendSize);

    d3.selectAll(".dc-legend").style(
      "display",
      params.Legendswatch === undefined ? "none" : params.Legendswatch
    );

    d3.select("body").on("mouseover", function () {
      d3.selectAll("circle.dot")
        .on("mouseover", function (d) {
          div2
            .transition()
            .duration(500)
            .style("opacity", params.Tooltipswatch);
          // .style("font-family", params.TooltipFont)
          // .style("color", params.TooltipColor)
          // .style("font-size", params.TooltipSize + "px")
          // .style("background-color", params.TooltipBGColor)
          // .style("border", params.TooltipThickness + 'px ' + params.TooltipTickColor + ' solid')
          if (params.TooltipContent === "X") {
            div2.html(
              "<div><div><b>" +
                params.XAxis +
                "</b> : " +
                timeFormat_(d.target.__data__.x) +
                "</div><div"
            );
          } else if (params.TooltipContent === "Y") {
            div2.html(
              "<div><div><b>" +
                params.YAxis +
                "</b> : " +
                d.target.__data__.y.toFixed(2) +
                "</div><div"
            );
          } else if (params.TooltipContent === "Group") {
            div2.html(
              "<div><div><b>" +
                params.GroupBy +
                "</b> : " +
                d.target.__data__.layer +
                "</div><div>"
            );
          } else if (params.TooltipContent === "All") {
            div2.html(
              "<div><div><b>" +
                params.GroupBy +
                "</b> : " +
                d.target.__data__.layer +
                "</div><div><b>" +
                params.XAxis +
                "</b> : " +
                timeFormat_(d.target.__data__.x) +
                "</div><div><b>" +
                params.YAxis +
                "</b> : " +
                d.target.__data__.y.toFixed(2) +
                "</div></div>"
            );
          }
          div2.style("left", d.pageX + "px").style("top", d.pageY - 50 + "px");
        })
        .on("mouseout", function (d) {
          div2.transition().duration(500).style("opacity", 0);

          d3.selectAll("circle.dot")
            .style("fill-opacity", "1e-06")
            .style("stroke-opacity", "1e-06");
          d3.selectAll("path.yRef").attr("d", "");
          d3.selectAll("path.xRef").attr("d", "");
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
    resizing(chart);
  });
  const Chartheader = () => {
    return (
      <div
        style={{
          backgroundColor: params.Seriesswatch === "show" ? params.BGColor : "",
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
    <Grid item>
      <Grid item className="cardbox chartbox">
        <Chartheader />
        <div
          style={{
            backgroundColor:
              params.Seriesswatch === "show" ? params.BGColor : "",
          }}
          id="Charts"
        >
          <div ref={div} className="boxcenter"></div>
        </div>
      </Grid>
    </Grid>
  );
};

export default React.memo(SeriesChart);
