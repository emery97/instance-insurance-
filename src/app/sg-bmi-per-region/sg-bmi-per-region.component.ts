import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-sg-bmi-per-region',
  templateUrl: './sg-bmi-per-region.component.html',
  styleUrls: ['./sg-bmi-per-region.component.css']
})
export class SgBmiPerRegionComponent implements OnInit {

  ngOnInit(): void {
    const width = 975, height = 610;

    // Load the Singapore GeoJSON and average BMI data
    Promise.all([
      d3.json("sg-map.json"),  // Your Singapore GeoJSON file
      d3.json("http://localhost:3000/insurance/avg-bmi")  // Average BMI API endpoint
    ]).then(([GeoJsonSg, avgBmi]: [any, any]) => {
      console.log("SG map GeoJSON:", GeoJsonSg);
      console.log("Average BMI Data:", avgBmi);

      // Create a map of region names to average BMI values (normalize to lowercase)
      const bmiMap = new Map(avgBmi.map((d: any) => [d.region.toLowerCase(), parseFloat(d.average_bmi)])); 

      // Add BMI data as properties to the GeoJSON features
      GeoJsonSg.features.forEach((feature: any) => {
        let regionName = feature.properties.name.toLowerCase().replace(/\s+/g, '');;
        feature.properties.bmi = bmiMap.get(regionName) || null; // Add BMI or null if not available
      });

      // Define a color scale for BMI values (example with red color gradient)
      const color = d3.scaleSequential(d3.interpolateBlues).domain([20, 50]); // Adjust domain as needed

      // Create the path generator for projecting GeoJSON data onto SVG paths
      const projection = d3.geoMercator().fitSize([width, height], GeoJsonSg);
      const path = d3.geoPath().projection(projection);

      // Append the SVG element to render the map
      const svg = d3.select("#sg-map")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("max-width", "100%")
        .style("height", "auto");

      // Draw the regions (polygons) with fill colors based on BMI values
      svg.append("g")
        .selectAll("path")
        .data(GeoJsonSg.features)
        .join("path")
        .attr("d", path as unknown as string)
        .attr("fill", (d: any) => color(d.properties.bmi || 20)) // Apply color scale based on BMI
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .append("title")
        .text((d: any) => `${d.properties.name}: BMI ${d.properties.bmi !== null ? d.properties.bmi : "N/A"}`);

      console.log("Map rendered successfully.");
    }).catch(error => {
      console.error("Error loading data:", error);
    });
  }
}
