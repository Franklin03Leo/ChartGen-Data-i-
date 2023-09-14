import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function CountPlot({ data }) {    
  const svgRef = useRef(null);

  useEffect(() => {
    if (data.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 250 - margin.left - margin.right;
    const height = 150 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('color', 'grey') 
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const counts = d3.rollup(data, v => v.length, d => d);

    const xScale = d3.scaleBand()
      .domain(Array.from(counts.keys()))
      .range([0, width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(Array.from(counts.values()))])
      .nice()
      .range([height, 0]);

    svg.selectAll('.bar')
      .data(Array.from(counts.entries()))
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('fill','#8884d8')
      .attr('x', d => xScale(d[0]))
      .attr('y', d => yScale(d[1]))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d[1]));

    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale));
  }, [data]);

  return (
    <svg ref={svgRef}></svg>
  );
}

export default CountPlot;