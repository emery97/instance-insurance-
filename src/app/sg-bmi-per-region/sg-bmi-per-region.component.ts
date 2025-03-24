import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';
import * as topojson from 'topojson-client';
import { interpolateOrRd } from 'd3-scale-chromatic';

@Component({
  selector: 'app-sg-bmi-per-region',
  templateUrl: './sg-bmi-per-region.component.html',
  styleUrls: ['./sg-bmi-per-region.component.css']
})
export class SgBmiPerRegionComponent implements OnInit {

  ngOnInit(): void {
    const width = 975, height = 610;

    // Load CSV and JSON data
    Promise.all([
      d3.csv("unemployment201907.csv"), // You might replace this with your own data source
      d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json"),
      d3.json("http://localhost:3000/insurance/avg-bmi") // Replace with real BMI data endpoint
    ]).then(([unemploymentData, sgGeoData, avgBmi]: [any, any, any]) => {
      console.log("Unemployment Data:", unemploymentData);
      console.log("GeoJSON Data for Singapore:", sgGeoData);
      console.log("Average BMI Data:", avgBmi);

      // 1. Build a map from region name -> region ID (Update to reflect Singapore's region names)
      const nameToId = new Map(
        sgGeoData.objects.states.geometries.map((d: { properties: { name: any; }; id: any; }) => [d.properties.name, d.id])
      );

      // 2. Build a map from region ID -> BMI data
      const idToRate = new Map();
      for (const row of unemploymentData) {
        const stateId = nameToId.get(row['name']);
        if (stateId !== undefined) {
          idToRate.set(stateId, +row['rate']);  // Ensure the rate is a number
        }
      }


      console.log("BMI Value Map:", idToRate);
      const color = d3.scaleSequential(d3.schemeGreens[9]);  // The range of your data
  
      // 4. Set up the geographic path generator
      const path = d3.geoPath();

      // 5. Convert TopoJSON to GeoJSON features (if needed)
      const processedData = (topojson.feature(sgGeoData, sgGeoData.objects.states) as any).features;

      // 6. Create the SVG element to render the map
      const svg = d3.select("#sg-map")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("max-width", "100%")
        .style("height", "auto");

      // 7. Append the map paths (regions) and apply color based on BMI data
      svg.append("g")
        .selectAll("path")
        .data(processedData)
        .join("path")
        .attr("d", path as unknown as string)
        .attr("fill", (d: any) => {
          const rate = idToRate.get(d.id);
          return rate == null ? "#eee" : color(rate); // Use color scale to fill based on BMI
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

      // 8. Draw internal region borders
      svg.append("path")
        .datum(topojson.mesh(sgGeoData, sgGeoData.objects.states, (a: any, b: any) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);

      console.log("Map rendered successfully.");
    }).catch(error => {
      console.error("Error loading data:", error);
    });
  }
}
