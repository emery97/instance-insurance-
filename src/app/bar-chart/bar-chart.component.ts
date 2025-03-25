import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  imports: [],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent implements OnInit {

  ngOnInit(): void {
    const margin = { top: 5, right: 20, bottom: 60, left: 60 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    Promise.all([
      d3.json("http://localhost:3000/insurance/age")
    ]).then(([ageData]: [any]) => {
      console.log("Age data:", ageData);

      // Create SVG with proper margins
      const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .style("max-width", "100%")
        .style("height", "auto")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const xScale = d3.scaleBand()
        .domain(ageData.map((d: any) => d.age_group))
        .range([0, width])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(ageData, (d: any) => +d.customers || +d.value) as number])
        .nice()
        .range([height, 0]);

      const xAxis = d3.axisBottom(xScale);

      const yAxis = d3.axisLeft(yScale)
      .tickFormat(d3.format('d')) 
      .ticks(5); 

      // Append X-axis to SVG
      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-45)")
        .attr("dx", "-.8em")
        .attr("dy", "1em");

      // Append Y-axis to SVG
      svg.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);

      // Add X-axis label
      svg.append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 5)
      .style("text-anchor", "middle")
      .style("font-size", "13px")
      .text("Age Group");

      // Styling for Y-axis label
      svg.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 15)
        .style("text-anchor", "middle")
        .style("font-size", "13px")
        .style("font-family", "Arial, sans-serif")
        .text("Number of Customers");

      // Create bars with 70% width and centered
      const tooltip = d3.select("#tooltip");
      svg.selectAll('.bar')
        .data(ageData)
        .enter().append('rect')
        .attr('class', 'bar')
        // Calculate x position to center the 70% width bar
        .attr('x', (d: any) => {
          const bandWidth = xScale.bandwidth();
          return (xScale(d.age_group) ?? 0) + (bandWidth * 0.15); // 15% offset from left
        }) 
        .attr('y', (d: any) => yScale(d.customers || d.value))
        // Set width to 70% of bandwidth
        .attr('width', (d: any) => xScale.bandwidth() * 0.7) 
        .attr('height', (d: any) => height - yScale(d.customers || d.value))
        .attr('fill', '#2CAFFE')
        .on("mouseover", (event, d: any) => {
          tooltip.style("visibility", "visible")
            .html(`Age Group: ${d.age_group}<br>Customers: ${d.customers || d.value}`)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mousemove", (event) => {
          tooltip.style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden");
        });
    });
  }
}