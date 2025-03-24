
import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';
import * as topojson from 'topojson-client';

@Component({
  selector: 'app-sg-bmi-per-region',
  imports: [],
  templateUrl: './sg-bmi-per-region.component.html',
  styleUrl: './sg-bmi-per-region.component.css'
})
export class SgBmiPerRegionComponent implements OnInit {

  ngOnInit(): void {
    const width = 975, height = 610;

    // Load CSV and JSON data
    Promise.all([
      d3.csv("unemployment201907.csv"),
      d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json")
    ]).then(([unemploymentData, us]: [any, any]) => {
      console.log("Unemployment Data:", unemploymentData);
      console.log("TopoJSON Data:", us);

      // 1. Build a map from state name -> state ID
      const nameToId = new Map(
        us.objects.states.geometries.map((d: { properties: { name: any; }; id: any; }) => [d.properties.name, d.id])
      );

      // 2. Build a map from state ID -> unemployment rate
      const idToRate = new Map();
      for (const row of unemploymentData) {
        const stateId = nameToId.get(row['name']);
        if (stateId !== undefined) {
          idToRate.set(stateId, +row['rate']);  // Ensure the rate is a number
        }
      }

      console.log("Value Map:", idToRate);

      // 3. Set up the color scale (quantized from 1% to 10%)
      const color = d3.scaleQuantize([1, 10], d3.schemeBlues[9]);

      // 4. Set up the geographic path generator
      const path = d3.geoPath();

      // 5. Convert TopoJSON to GeoJSON features
      const processedData = (topojson.feature(us, us.objects.states) as any).features;

      // 6. Create the SVG element to render the map
      const svg = d3.select("#sg-map")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("max-width", "100%")
        .style("height", "auto");


      // 9. Append the map paths (states) and apply color based on unemployment rate
      svg.append("g")
        .selectAll("path")
        .data(processedData)
        .join("path")
        .attr("d", path as unknown as string)
        .attr("fill", (d: any) => {
          const rate = idToRate.get(d.id);
          return rate == null ? "#eee" : color(rate);  // Use color scale to fill based on unemployment rate
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .append("title")
        .text((d: any) => {
          const rate = idToRate.get(d.id);
          return rate == null
            ? `${d.properties.name}\nNo data`
            : `${d.properties.name}\n${rate}%`;
        });

      // 10. Draw internal state borders
      svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, (a: any, b: any) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")  // Set border color to white for visibility
        .attr("stroke-linejoin", "round")
        .attr("d", path);

      console.log("Map rendered successfully.");
    }).catch(error => {
      console.error("Error loading data:", error);
    });
  }
}
