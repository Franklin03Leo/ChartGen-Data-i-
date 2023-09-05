import React from "react"; //, { useEffect, useRef, useState }
import * as dc from "dc";
//import * as d3 from "d3";
import * as crossfilter from "crossfilter2/crossfilter";
import Grid from "@material-ui/core/Grid";
// import '../styles/customcss.css';
import { Alert } from "@mui/material";

import * as d3module from "d3";
import d3tip from "d3-tip";
const d3 = {
  ...d3module,
  tip: d3tip,
};

const StackrowChart = ({ dataParentToChild }) => {
  const div = React.useRef(null);
  var tipvalue = "title";
  var rowtip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function (d) {
      var split = tipvalue.split("\n");
      //var retdiv = '<div>';
      var retdiv = '<div class="class_tooltip">';
      for (var i = 0; i < split.length; i++) {
        retdiv = retdiv + split[i] + "<br>";
      }
      retdiv = retdiv + "</div>";
      return retdiv;
      //return '<div>'+tipvalue+'</div>';
    });
  const tipremove = () => {
    var tipelements = document.getElementsByClassName("class_tooltip");
    var tiplength = tipelements.length;
    for (var i = tiplength - 1; i >= 0; i--) {
      tipelements[i].remove();
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
    function handleClick(e) {
      rowtip.hide(e, this);
      // if (innerRef.current && callbackRef.current && !innerRef.current.contains(e.target)
      // ) callbackRef.current(e);
    }
  }, []); // no dependencies -> stable click listener

  React.useEffect(() => {
    var formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    let compositeChart = dc.compositeChart(div.current);

    const BAR_PADDING = 0.1; // percentage the padding will take from the bar
    const RANGE_BAND_PADDING = 0.5; // padding between 'groups'
    const OUTER_RANGE_BAND_PADDING = 0.5; // padding from each side of the chart
    var clientHeight = document.getElementById("divstackrowchart").clientHeight;
    var clientWidth = document.getElementById("divstackrowchart").clientWidth;
    var offsetHeight = document.getElementById("divstackrowchart").offsetHeight;
    var offsetWidth = document.getElementById("divstackrowchart").offsetWidth;
    let sizing = (chart) => {
      chart.width(offsetWidth).height(offsetHeight).redraw();
    };
    //let sizing = chart => {chart.width(clientWidth).height(clientHeight).redraw();};
    //let sizing = chart => {chart.width(window.innerWidth).height(window.innerHeight).redraw();};
    let resizing = (chart) => (window.onresize = () => sizing(chart));

    let barPadding;
    let scaleSubChartBarWidth = (chart) => {
      let subs = chart.selectAll(".sub");

      if (typeof barPadding === "undefined") {
        // first draw only
        barPadding = (BAR_PADDING / subs.size()) * 100;
        barPadding = barPadding / 2;
      }

      let startAt,
        endAt,
        subScale = d3.scaleLinear().domain([0, subs.size()]).range([0, 100]);

      subs.each(function (d, i) {
        startAt = subScale(i + 1) - subScale(1);
        endAt = subScale(i + 1);
        startAt += barPadding;
        endAt -= barPadding;
        d3.select(this)
          .selectAll("rect")
          .attr(
            "clip-path",
            `polygon(${startAt}% 0, ${endAt}% 0, ${endAt}% 100%, ${startAt}% 100%)`
          );
      });
    };
    let data = [
      {
        WorkflowStage: "Disclosure Signed",
        LoanPurpose: "Purchase",
        TotalVolume: 1000,
        EstimatedVolume: 800,
      },
      {
        WorkflowStage: "Disclosure Signed",
        LoanPurpose: "Refinance",
        TotalVolume: 2000,
        EstimatedVolume: 1500,
      },
      {
        WorkflowStage: "Appraisal Ordered",
        LoanPurpose: "Purchase",
        TotalVolume: 3000,
        EstimatedVolume: 2000,
      },
      {
        WorkflowStage: "Appraisal Ordered",
        LoanPurpose: "Refinance",
        TotalVolume: 1500,
        EstimatedVolume: 700,
      },
      {
        WorkflowStage: "Locked",
        LoanPurpose: "Purchase",
        TotalVolume: 1000,
        EstimatedVolume: 800,
      },
      {
        WorkflowStage: "Locked",
        LoanPurpose: "Refinance",
        TotalVolume: 2200,
        EstimatedVolume: 1800,
      },
      {
        WorkflowStage: "Registered",
        LoanPurpose: "Purchase",
        TotalVolume: 1300,
        EstimatedVolume: 500,
      },
      {
        WorkflowStage: "Registered",
        LoanPurpose: "Refinance",
        TotalVolume: 1900,
        EstimatedVolume: 500,
      },
      {
        WorkflowStage: "Suspend",
        LoanPurpose: "Purchase",
        TotalVolume: 1400,
        EstimatedVolume: 600,
      },
      {
        WorkflowStage: "Suspend",
        LoanPurpose: "Refinance",
        TotalVolume: 2300,
        EstimatedVolume: 1800,
      },
      {
        WorkflowStage: "Conditional Approval",
        LoanPurpose: "Purchase",
        TotalVolume: 1800,
        EstimatedVolume: 1500,
      },
      {
        WorkflowStage: "Conditional Approval",
        LoanPurpose: "Refinance",
        TotalVolume: 3100,
        EstimatedVolume: 2100,
      },
      {
        WorkflowStage: "Resubmission",
        LoanPurpose: "Purchase",
        TotalVolume: 4000,
        EstimatedVolume: 3500,
      },
      {
        WorkflowStage: "Resubmission",
        LoanPurpose: "Refinance",
        TotalVolume: 3800,
        EstimatedVolume: 2800,
      },
      {
        WorkflowStage: "Approved For Closing Docs",
        LoanPurpose: "Purchase",
        TotalVolume: 2800,
        EstimatedVolume: 1800,
      },
      {
        WorkflowStage: "Approved For Closing Docs",
        LoanPurpose: "Refinance",
        TotalVolume: 3000,
        EstimatedVolume: 1900,
      },
      {
        WorkflowStage: "Docs Sent To Title",
        LoanPurpose: "Purchase",
        TotalVolume: 2000,
        EstimatedVolume: 1000,
      },
      {
        WorkflowStage: "Docs Sent To Title",
        LoanPurpose: "Refinance",
        TotalVolume: 1000,
        EstimatedVolume: 500,
      },
      {
        WorkflowStage: "Docs Returned From Title",
        LoanPurpose: "Purchase",
        TotalVolume: 1000,
        EstimatedVolume: 800,
      },
      {
        WorkflowStage: "Docs Returned From Title",
        LoanPurpose: "Refinance",
        TotalVolume: 1000,
        EstimatedVolume: 800,
      },
    ];
    //data = dataParentToChild[0];

    var range = [];
    var size = [];
    var Purchase = 0,
      Refinance = 0,
      Estimated_Purchase = 0,
      Estimated_Refinance = 0;
    for (var i = 0; i < data.length; i++) {
      if (range.indexOf(data[i].WorkflowStage === -1))
        range.push(data[i].WorkflowStage);
      size.push(data[i].TotalVolume);
      if (data[i].LoanPurpose === "Purchase") {
        Purchase += data[i].TotalVolume;
        Estimated_Purchase += data[i].EstimatedVolume;
      } else {
        Refinance += data[i].TotalVolume;
        Estimated_Refinance += data[i].EstimatedVolume;
      }
    }

    var myTable = document.getElementById("total");
    if (myTable != undefined) {
      myTable.rows[1].cells[0].innerHTML = formatter.format(Purchase);
      myTable.rows[1].cells[1].innerHTML = formatter.format(Estimated_Purchase);
      myTable.rows[1].cells[2].innerHTML = formatter.format(Refinance);
      myTable.rows[1].cells[3].innerHTML =
        formatter.format(Estimated_Refinance);
    }

    var max = Math.max(...size);
    let ndx = crossfilter(data),
      dimension = ndx.dimension((d) => d.WorkflowStage);
    //group = {all: () => data}; // for simplicity sake (take a look at crossfilter group().reduce())
    var grp1 = dimension.group().reduceSum(function (d) {
      return d.LoanPurpose === "Purchase" ? d.TotalVolume : 0;
    });
    var grp2 = dimension.group().reduceSum(function (d) {
      return d.LoanPurpose === "Refinance" ? d.TotalVolume : 0;
    });
    var grp3 = dimension.group().reduceSum(function (d) {
      return d.LoanPurpose === "Purchase" ? d.EstimatedVolume : 0;
    });
    var grp4 = dimension.group().reduceSum(function (d) {
      return d.LoanPurpose === "Refinance" ? d.EstimatedVolume : 0;
    });
    // var tipvalue = 'title';

    // var rowtip = d3.tip()
    //     .attr('class', 'd3-tip')
    //     .offset([-10, 0])
    //     .html(function (d) {
    //       debugger
    //       //alert(tipvalue = obj.firstElementChild)
    //       return tipvalue;
    //       //return "<div id='distr'>Distribution<br></div>";
    //       //return d.key + ": "  + d.value;
    //     });

    let barChart1 = dc
      .barChart(compositeChart)
      .gap(10)
      .title((d) => {
        return (
          d.key + "\n" + "Volume: " + formatter.format(d.value).slice(0, -3)
        );
        //return d.key + `[${d.LoanPurpose}]: ` + d.TotalVolume
      })
      .renderLabel(true)
      .yAxisPadding("12%")
      .label(function (d) {
        return "$" + BMKlabel(d.y1);
      })
      //       .useRightYAxis(true)
      .colors(
        d3.scaleOrdinal(["rgba(92, 179, 255)", "rgba(92, 179, 255, 0.6)"])
      )
      .group(grp1, "grp1 Bar")
      .stack(grp2, "grp2 Bar");

    let barChart2 = dc
      .barChart(compositeChart)
      .gap(10)
      .title((d) => {
        return (
          d.key + "\n" + "Volume: " + formatter.format(d.value).slice(0, -3)
        );
      })
      .renderLabel(true)
      .yAxisPadding("12%")
      .label(function (d) {
        return "$" + BMKlabel(d.y1);
      })
      //   .useRightYAxis(true)
      .colors(
        d3.scaleOrdinal(["rgba(144, 238, 144)", "rgba(144, 238, 144,0.6)"])
      )
      .group(grp3, "grp3 Bar")
      .stack(grp4, "grp4 Bar");

    let barChart3 = dc
      .barChart(compositeChart)
      .gap(10)
      .title((d) => {
        return (
          d.key + "\n" + "Volume: " + formatter.format(d.value).slice(0, -3)
        );
      })
      .renderLabel(true)
      .yAxisPadding("12%")
      .label(function (d) {
        return "$" + BMKlabel(d.y1);
      })
      //  .useRightYAxis(true)
      .colors(
        d3.scaleOrdinal(["rgba(144, 238, 144)", "rgba(144, 238, 144,0.6)"])
      )
      .group(grp3, "grp3 Bar")
      .stack(grp4, "grp4 Bar");

    compositeChart
      .margins({ top: 20, right: 50, bottom: 165, left: 0 })
      .width(null)
      .height(null)
      .shareTitle(false)
      .dimension(dimension)
      .group(grp1)
      ._rangeBandPadding(RANGE_BAND_PADDING)
      ._outerRangeBandPadding(OUTER_RANGE_BAND_PADDING)
      .x(d3.scaleOrdinal())
      .xUnits(dc.units.ordinal)
      .y(d3.scaleLinear().domain([0, max]))
      .compose([barChart1, barChart2, barChart3])
      .on("pretransition", (chart) => {
        scaleSubChartBarWidth(chart);
      })
      // .on("filtered", (chart, filter) => {
      //     console.log(chart, filter);
      // })
      .on("preRedraw", (chart) => {
        chart.rescale();
      })
      .on("preRender", (chart) => {
        chart.rescale();
      })
      .renderlet(function (chart) {
        chart
          .selectAll("g.x text")
          .attr("dx", "-10")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-90)");

        // chart.selectAll("g.y text")
        // //.attr('dy', '-10')
        // .attr('x', '25')
        // //.attr('text-anchor', 'end')
        // .attr('transform', "rotate(180)");

        //chart.selectAll('g.x.axis g text').each(insertLinebreaks);

        chart
          .selectAll("g.yr text")
          .attr("x", "-25")
          //.attr('text-anchor', 'end')
          .attr("transform", "rotate(210)");

        chart
          .selectAll("rect")
          .call(rowtip)
          .on("click", function (d) {
            d.stopPropagation();
            tipremove();
            tipvalue = this.firstElementChild.innerHTML;
            rowtip.show(d, this);
          });

        chart
          .selectAll("g text.barLabel")
          .attr("text-anchor", "start")

          .attr("transform", function (d) {
            var x = d3.select(this).attr("x");
            var y = d3.select(this).attr("y");
            if (d.layer === "grp2 Bar" || d.layer === "grp1 Bar") {
              //y = parseFloat(y) + 5;
              x = parseFloat(x) - 5;
            } else if (d.layer === "grp3 Bar" || d.layer === "grp4 Bar") {
              y = parseFloat(y) - 15;
              x = parseFloat(x);
            }
            return "rotate(-90, " + x + ", " + y + ")";
          })
          .attr("x", function (d) {
            var x = d3.select(this).attr("x");
            if (d.layer === "grp2 Bar" || d.layer === "grp1 Bar")
              x = parseFloat(x);
            else if (d.layer === "grp3 Bar" || d.layer === "grp4 Bar")
              x = parseFloat(x);
            return x;
          });
        //chart.svg().select('g').attr("transform","rotate(90, 300, 300)");
      });

    //   compositeChart.on('pretransition.add-tip', function(chart) {
    //     chart.selectAll('g.row')
    //         .call(rowtip)
    //         .on('mouseover', rowtip.show)
    //         .on('mouseout', rowtip.hide);
    // });

    compositeChart.rightYAxis().tickFormat(function (v) {
      return BMK(v);
    });
    dc.renderAll();
    setTimeout(() => {
      barlabelpostion();
    }, 1000);
    sizing(compositeChart);
    resizing(compositeChart);

    function barlabelpostion() {
      var list = document.getElementsByClassName("barLabel");
      for (var i = 0; i < list.length; i++) {
        var value = list[i].attributes.x.value;
        //console.log(list[i].innerHTML);
        //if(i % 2 == 0) {
        if (list[i].__data__.layer == "grp4 Bar") {
          //console.log("The number is even.");
          list[i].attributes.x.value = parseFloat(value) - 18;
        } else {
          //if (list[i].innerHTML != "$0.0")
          list[i].attributes.x.value = parseFloat(value) - 7;
        }
      }
    }

    var insertLinebreaks = function (d) {
      var el = d3.select(this);
      //var words = d.split(' ');
      var words = d.replace(/\s+/, "\x01").split("\x01");
      el.text("");

      for (var i = 0; i < words.length; i++) {
        var tspan = el.append("tspan").text(words[i]);
        if (i > 0) tspan.attr("x", 0).attr("dy", "15");
      }
    };

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

    function BMKlabel(labelValue) {
      // Nine Zeroes for Billions
      return Math.abs(Number(labelValue)) >= 1.0e9
        ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(1) + "B"
        : // Six Zeroes for Millions
        Math.abs(Number(labelValue)) >= 1.0e6
        ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(1) + "M"
        : // Three Zeroes for Thousands
        Math.abs(Number(labelValue)) >= 1.0e3
        ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(1) + "K"
        : Math.abs(Number(labelValue)).toFixed(1);
    }
  });

  return (
    <Grid item xs={12} md={12} xl={6} lg={6} className="containerfit">
      <Grid item className="cardbox" style={{ height: "fit-content" }}>
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            fontWeight: "bold",
          }}
        >
          Pipeline Analysis
        </div>

        {/* <div style={{padding:"1%",fontSize: "14px"}}>
        <table id="total">
        <thead>
        <tr>
            <th>Total Purchase</th><th>Total Refinance</th>
            <th>Total Estimated Purchase</th><th>Total Estimated Refinance</th>
            </tr>
        </thead>
          <tbody>
            <tr>
              <td>Value1</td>
              <td>Value2</td>
              <td>Value3</td>
              <td>Value4</td>
            </tr></tbody></table>
        </div> */}

        <div style={{ justifyContent: "center", display: "flex" }}>
          <div className="legendhead">
            <span
              className="legendsquare"
              style={{ backgroundColor: "#5CB3FF" }}
            ></span>
            <span>Purchase</span>
          </div>
          <div className="legendhead">
            <span
              className="legendsquare"
              style={{ backgroundColor: "#5cb3ff99" }}
            ></span>
            <span>Refinance</span>
          </div>
          <div className="legendhead">
            <span
              className="legendsquare"
              style={{ backgroundColor: "#90ee90" }}
            ></span>
            <span>Estimated Purchase</span>
          </div>
          <div className="legendhead">
            <span
              className="legendsquare"
              style={{ backgroundColor: "#90ee9099" }}
            ></span>
            <span>Estimated Refinance</span>
          </div>
        </div>

        <div className="boxcenter" id="divstackrowchart" ref={div}></div>
      </Grid>
    </Grid>
  );
};
export default StackrowChart;
