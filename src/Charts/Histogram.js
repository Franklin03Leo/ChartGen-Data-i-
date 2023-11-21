import React, { Component } from 'react'
import * as dc from 'dc';
import { Tooltip, BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer } from 'recharts';
import "../App.css";
// import Tooltip from "@mui/material/Tooltip";
// import BarChart from "../Charts/BarChart";


const HistogramChart = ({ params }) => {   
  const chartOptions = {
    //title: 'Charges of subatomic particles',
    //legend: { position: 'top', maxLines: 2 },
    colors: ['#5C3292', '#1A8763', '#871B47', '#999999'],
    interpolateNulls: false,
 }
  const HistogramData = [
    
      ['Quarks', 'Leptons', 'Gauge Bosons', 'Scalar Bosons'],
      [2 / 3, -1, 0, 0],
      [2 / 3, -1, 0, null],
      [2 / 3, -1, 0, null],
      [-1 / 3, 0, 1, null],
      [-1 / 3, 0, -1, null],
      [-1 / 3, 0, null, null],
      [-1 / 3, 0, null, null]
  ];
 // Conversion of bins....
   const min = Math.min(...params);
  const max = Math.max(...params);
  const numberOfBins = 5; // Adjust this based on your preference
  const binWidth = (max - min) / numberOfBins;
  const bins = [];
for (let i = 0; i < numberOfBins; i++) {
    const binStart = min + i * binWidth;
    const binEnd = binStart + binWidth;
    const binValues = params.filter(value => value >= binStart && value < binEnd);
    bins.push({
        binStart,
        binEnd,
        count: binValues.length,
    });
    
}

   // End of Conversion of bins....

   if (params.length !== 0)  dc.renderAll();
   else  dc.renderAll("HistogramChart");
   //render() {
  return (
    <ResponsiveContainer  width="70%" height= {500} >
      <BarChart data={bins}>
            <XAxis dataKey="binStart" />
            <YAxis />
            <Tooltip cursor={false} />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
    </ResponsiveContainer>
    )
  }

export default HistogramChart;
//export default React.memo(HistogramChart);
// //****************************** */
// import React, { Component } from 'react';
// import * as dc from 'dc';
// import * as crossfilter from "crossfilter2/crossfilter";
// import 'dc/dc.css'; // Import the dc.css stylesheet

// //class HistogramChart extends Component {
//    const HistogramChart = ({ params }) => {
//    //componentDidMount() {
//    //   // Sample data
//    //   const data = [
//    //     { value: 10 },
//    //     { value: 20 },
//    //     { value: 30 },
//    //     { value: 15 },
//    //     { value: 25 },
//    //     // Add more data points as needed
//    //   ];
     
//      // Create a crossfilter instance
//      const ndx = crossfilter(params);
 
//      // Create a dimension on the 'value' field
//       //const valueDimension = ndx.dimension((d) => d.value);
//       const valueDimension = ndx.dimension((d) => d);
 
//      // Create a histogram chart
//      const histogramChart = dc.rowChart('#histogram-chart');
 
//      // Configure the histogram chart
//      histogramChart
//        .dimension(valueDimension)
//        .group(valueDimension.group().reduceCount())
//        //.xAxisLabel('Bins')
//       // .yAxisLabel('Frequency')
//        .elasticX(true)
//        .width(10) // Adjust the chart width as needed
//        .height(5); // Adjust the chart height as needed
 
//      // Render the histogram chart
//      //histogramChart.render();
//    //}
 
//    if (params.length !== 0) dc.renderAll();
//    else dc.renderAll("HistogramChart");

//    return (
//       <div>
//         {/* <h2>Histogram Chart</h2> */}
//         <div id="histogram-chart"></div>
//       </div>
//     );
   
//  }
 
//  export default HistogramChart;