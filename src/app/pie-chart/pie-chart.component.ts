import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

// Define a type for the data with proper typing
interface GenderData {
  sex: string;
  count: number;
}

// Define a type for the pie slice data
interface PieSliceData extends d3.PieArcDatum<GenderData> {}

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  ngOnInit(): void {
    const margin = 10;
    const width = 500;
    const height = 400;
    
    // Setting the radius of the pie
    const radius = Math.min(width, height) / 2 - margin;
    
    // Fetching data
    d3.json("http://localhost:3000/insurance/sex")
      .then((data: unknown) => {
        // Type assertion to ensure the data is of the correct type
        const genderData = data as GenderData[];
        
        console.log("gender data: ", genderData);
        
        // Setting up the SVG canvas
        const svg = d3.select("#pie-chart")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", `0 0 ${width} ${height}`)
          .style("max-width", "100%")
          .style("height", "auto")
          .append("g")
          .attr("transform", `translate(${width / 2},${height / 2})`);
        
        // Color scale
        const color = d3.scaleOrdinal<string>()
          .domain(genderData.map(d => d.sex))
          .range(["#699cb3", "#f8d3cb"]);
        
        // Pie chart generator
        const pie = d3.pie<GenderData>()
          .value((d: GenderData) => d.count);
        
        // Arc generator for pie slices
        const arcGenerator = d3.arc<PieSliceData>()
          .innerRadius(0)
          .outerRadius(radius);
        
        // Creating the pie slices
        const arcs = pie(genderData);
        
        svg.selectAll('path')
          .data(arcs)
          .enter()
          .append('path')
          .attr('d', arcGenerator)
          .attr('fill', (d: PieSliceData) => color(d.data.sex))
          .attr('stroke', '#fff')
          .style('stroke-width', '2px');
        
        // Adding labels
        svg.selectAll('text')
          .data(arcs)
          .enter()
          .append('text')
          .text((d: PieSliceData) => `${d.data.sex}: ${d.data.count}`)
          .attr('transform', (d: PieSliceData) => `translate(${arcGenerator.centroid(d)})`)
          .style('text-anchor', 'middle')
          .style('fill', '#fff')
          .style('font-size', '14px');
      })
      .catch((error) => {
        console.error('Error loading the data:', error);
      });
  }
}