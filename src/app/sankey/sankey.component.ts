import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal, SankeyGraph } from 'd3-sankey';

interface SankeyNode {
  name: string;
  type: string;
  // Computed by the sankey layout:
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
}

interface SankeyLink {
  source: number | string;
  target: number | string;
  value: number;
  // Computed property for link thickness:
  width?: number;
}

// Interfaces for the backend data conversion:
interface BackendNode {
  node: number;
  name: string;
  type: string;
}

interface BackendNodesData {
  nodes: BackendNode[];
}

interface BackendLink {
  source: number;
  target: number;
  value: number;
}

interface BackendLinksData {
  links: BackendLink[];
}

@Component({
  selector: 'app-sankey',
  template: `<svg width="960" height="500"></svg>`,
  styles: [`
    svg {
      border: 1px solid #ccc;
    }
  `]
})
export class SankeyComponent implements OnInit {
  private svg!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private width = 960;
  private height = 500;

  constructor() {}

  ngOnInit(): void {
    // Select the SVG element
    this.svg = d3.select<SVGSVGElement, unknown>('svg');

    // Create the D3-Sankey layout generator
    const sankeyGenerator = sankey<SankeyNode, SankeyLink>()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [this.width - 1, this.height - 6]]);

    // Fetch data from the backend endpoint
    d3.json("http://localhost:3000/insurance/sankey")
      .then((data: any) => {
        console.log('Fetched data:', data);
        // If data is an array, select the first object
        const dataObject = Array.isArray(data) ? data[0] : data;

        // Convert raw backend data into nodes
        const nodesData = this.convertDataToNodes(dataObject);
        console.log("Converted Nodes: ", nodesData);

        // Create links based on node types
        const linksData = this.convertDataToLinks(nodesData);
        console.log("Converted Links: ", linksData);

        // Map backend nodes into the format expected by the Sankey layout
        const sankeyNodes: SankeyNode[] = nodesData.nodes.map((d: BackendNode) => ({
          name: d.name,
          type: d.type
        }));

        // Map backend links into the Sankey links format
        const sankeyLinks: SankeyLink[] = linksData.links.map((d: BackendLink) => ({
          source: d.source,
          target: d.target,
          value: d.value
        }));

        // Compute node and link positions using the sankey layout
        const graph: SankeyGraph<SankeyNode, SankeyLink> = sankeyGenerator({
          nodes: sankeyNodes.map(d => ({ ...d })),
          links: sankeyLinks.map(d => ({ ...d }))
        });

        // Render links using the sankeyLinkHorizontal generator
        this.svg.append("g")
          .attr("fill", "none")
          .attr("stroke", "#000")
          .attr("stroke-opacity", 0.2)
          .selectAll("path")
          .data(graph.links)
          .enter().append("path")
          .attr("d", sankeyLinkHorizontal())
          .style("stroke-width", (d: SankeyLink) => Math.max(1, d.width!));

        // Create a color scale for nodes
        const color = d3.scaleOrdinal<string, string>(d3.schemeCategory10);

        // Render nodes as rectangles
        this.svg.append("g")
          .selectAll("rect")
          .data(graph.nodes)
          .enter().append("rect")
          .attr("x", (d: SankeyNode) => d.x0!)
          .attr("y", (d: SankeyNode) => d.y0!)
          .attr("height", (d: SankeyNode) => d.y1! - d.y0!)
          .attr("width", (d: SankeyNode) => d.x1! - d.x0!)
          .style("fill", (d: SankeyNode) => color(d.name))
          .style("stroke", "#000");

        // Render node labels
        this.svg.append("g")
          .selectAll("text")
          .data(graph.nodes)
          .enter().append("text")
          .attr("x", (d: SankeyNode) => d.x0! - 6)
          .attr("y", (d: SankeyNode) => (d.y1! + d.y0!) / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "end")
          .text((d: SankeyNode) => d.name)
          .filter((d: SankeyNode) => d.x0! < this.width / 2)
          .attr("x", (d: SankeyNode) => d.x1! + 6)
          .attr("text-anchor", "start");
      })
      .catch((error: any) => {
        console.error("Error loading Sankey data: ", error);
      });
  }

  // Converts backend data (an object with keys) into an array of nodes.
  convertDataToNodes(data: Record<string, any>): BackendNodesData {
    if (!data || typeof data !== 'object') {
      console.error("Invalid data structure", data);
      return { nodes: [] };
    }
    const keys = Object.keys(data);
    const nodes = keys.map((key, index) => ({
      node: index,
      name: key,
      // Simple logic: if the key contains "revenue", we treat it as "total", otherwise as "inflow"
      type: key.toLowerCase().includes("revenue") ? "total" : "inflow"
    }));
    return { nodes };
  }

  // Creates links by connecting each "inflow" node to all "total" nodes.
  convertDataToLinks(data: BackendNodesData): BackendLinksData {
    const nodes = data.nodes;
    const inflows = nodes.filter(n => n.type === "inflow");
    const totals = nodes.filter(n => n.type === "total");

    let links: BackendLink[] = [];
    inflows.forEach(inflow => {
      totals.forEach(total => {
        links.push({
          source: inflow.node,
          target: total.node,
          value: 2 // Example value; adjust as needed.
        });
      });
    });
    return { links };
  }
}
