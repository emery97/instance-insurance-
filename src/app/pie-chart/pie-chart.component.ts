import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
interface GenderData {
  sex: string;
  count: number;
}

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css',
  encapsulation: ViewEncapsulation.None
})
export class PieChartComponent implements OnInit {
  ngOnInit(): void {
    const margin = 10;
    const width = 400;
    const height = 300;
    const radius = Math.min(width, height) / 2 - margin;

    d3.json<GenderData[]>("http://localhost:3000/insurance/sex")
      .then((genderData) => {
        // Check if genderData is defined and has elements
        if (genderData && genderData.length > 0) {
          const total = d3.sum(genderData, d => d.count);

          const svg = d3.select("#pie-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

          const color = d3.scaleOrdinal<string>()
            .domain(genderData.map(d => d.sex))
            .range(["#699cb3", "#f8d3cb"]);

          const pie = d3.pie<GenderData>()
            .value(d => d.count);

          const arcGenerator = d3.arc<d3.PieArcDatum<GenderData>>()
            .innerRadius(0)
            .outerRadius(radius);

          const slices = svg.selectAll('path')
            .data(pie(genderData))
            .enter()
            .append('path')
            .attr('fill', d => color(d.data.sex))
            .attr('stroke', '#fff')
            .style('stroke-width', '2px')
            .attr('d', arcGenerator)
            .style('cursor', 'pointer');

          const tooltip = d3.select("#pie-chart")
            .append("div")
            .attr("class", "tooltip");

          slices
            .on("mouseover", (event, d) => {
              const datum = d as d3.PieArcDatum<GenderData>;
              const sliceColor = d3.select(event.currentTarget).style("fill");

              tooltip.html(`
                <div class="tooltip-title">
                  <span style="color:${sliceColor}">&#8226;</span> 
                  <strong>${datum.data.sex}:</strong>
                </div>
                <div class="tooltip-content">
                  Count: ${datum.data.count}<br>
                  Percentage: ${(datum.data.count / total * 100).toFixed(1)}%
                </div>
              `)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 20}px`)
                .transition()
                .duration(200)
                .style("opacity", 1);
            })
            .on("mousemove", (event) => {
              tooltip
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 20}px`);
            })
            .on("mouseout", () => {
              tooltip.transition()
                .duration(200)
                .style("opacity", 0);
            });
        } else {
          console.error('No gender data available');
        }
      })
      .catch((error) => {
        console.error('Error loading the data:', error);
      });
  }
}
