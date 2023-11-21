import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function CountPlot({ data, colName}) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (data?.length === 0) return;
    let x_axisLength = [...new Set(data)]
  
    var div1 = d3
      .selectAll(".boxcenter")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("color", "black")
      .style("font-size", 15 + "px")
      .style("background-color", "grey");

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    // const width = 1300; //- margin.left - margin.right;
    const width=x_axisLength.length < 21 ? 995 : x_axisLength.length * 50;
    const height = 350; //- margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      // .attr("width", 1500)
      .attr("width",  width + margin.left + margin.right)
      .attr("height", 500)
      .style("overflow-x", x_axisLength.length < 21 ? "hidden" : "auto") // Hide scrollbar when data is short
      .attr("color", "grey")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const counts = d3.rollup(
      data,
      (v) => v.length,
      (d) => d
    );

    const xScale = d3
      .scaleBand()
      .domain(Array.from(counts.keys()))
      .range([0, width])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(Array.from(counts.values()))])
      .nice()
      .range([height, 0]);

    svg
      .selectAll(".bar")
      .data(Array.from(counts.entries()))
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("fill", "#8884d8")
      .attr("x", (d) => xScale(d[0]))
      .attr("y", (d) => yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d[1]));

    //adding tooltip
    d3.select("body").on("mouseover", function () {
      d3.selectAll("rect.bar")
        .on("mouseover", function (d) {
          div1
            .transition()
            .duration(100)
            .style("opacity", 0.9)
            .style("color", "white")
            .style("font-size", 14 + "px")
            .style("background-color", "#679DF6");

          div1.html(
            "<div><div><b>" +
            colName+":" +
              "</b>" +
              d.target.__data__[0] +
              "</div><div><b>" +
              `Count:` +
              "</b>" +
              parseFloat(d.target.__data__[1]).toFixed(2) +
              "</div></div>"
          );

          div1.style("left", d.pageX-100 + "px").style("top", d.pageY - 90 + "px");
        })
        .on("mouseout", function (d) {
          div1.transition().duration(100).style("opacity", 0);
        });
    });

    //end

    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0,352)")
      .call(d3.axisBottom(xScale).ticks(10))
      .selectAll("text") 
        .style("text-anchor", "end")
        .attr("transform", "rotate(-45)")

    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));
    
  }, [data,colName]);

  return (
    <div style={{ overflowX: 'auto', width: '100%', overflowY: 'hidden' }}>

      <svg ref={svgRef}></svg>

    </div>
  );
}

export default CountPlot;
