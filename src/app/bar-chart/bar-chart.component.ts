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
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

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
      const yAxis = d3.axisLeft(yScale);

      // Append X-axis to SVG
      svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-45)")
        .attr("dx", "-.8em")
        .attr("dy", ".15em");

      // Append Y-axis to SVG
      svg.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);

      // Add X-axis label
      svg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2 - 50)
        .attr("y", height + margin.bottom - 10)
        .style("text-anchor", "middle")
        .text("Age Group");

      // Add Y-axis label
      svg.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 10)
        .style("text-anchor", "middle")
        .text("Number of Customers");

      // Create bars with tooltip functionality
      const tooltip = d3.select("#tooltip");
      svg.selectAll('.bar')
        .data(ageData)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', (d: any) => xScale(d.age_group) as number)
        .attr('y', (d: any) => yScale(d.customers || d.value))
        .attr('width', xScale.bandwidth())
        .attr('height', (d: any) => height - yScale(d.customers || d.value))
        .attr('fill', 'steelblue')
        .on("mouseover", (event, d: any) => {
          tooltip.style("visibility", "visible")
            .html(`Age Group: ${d.age_group}<br>Customers: ${d.customers || d.value}`)
            .style("left", (event.pageX + 5) + "px") // Position tooltip
            .style("top", (event.pageY - 28) + "px"); // Position tooltip
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