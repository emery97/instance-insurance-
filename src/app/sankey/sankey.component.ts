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
  source: number | string | SankeyNode;
  target: number | string | SankeyNode;
  value: number;
  // Computed property for link thickness:
  width?: number;
}

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
      border: none;
    }
  `]
})
export class SankeyComponent implements OnInit {
  private svg!: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private width = 960;
  private height = 500;

  constructor() { }

  ngOnInit(): void {
    const self = this;

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
        const nodesData = self.convertDataToNodes(dataObject);
        console.log("Converted Nodes: ", nodesData);

        // Create links using the actual value from the backend data.
        const linksData = self.convertDataToLinks(nodesData, dataObject);
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

        // Render links using the sankeyLinkHorizontal generator with fade-in
        const linkGroup = this.svg.append("g")
          .attr("fill", "none")
          .attr("stroke", "#757575")  // Material Design gray tone for links
          .attr("stroke-opacity", 0.2);

        const linkPaths = linkGroup.selectAll("path")
          .data(graph.links)
          .enter().append("path")
          .attr("class", "link")
          .attr("d", sankeyLinkHorizontal())
          .style("stroke-width", (d: SankeyLink) => Math.max(1, d.width!))
          .attr("opacity", 0)
          .transition()
          .duration(1000)
          .attr("opacity", 1)
          .on("end", function (d) {
            const pathEl = this as SVGPathElement;
            const totalLength = pathEl.getTotalLength();
            const midpoint = pathEl.getPointAtLength(totalLength / 2);
            // Safely check if the parent node exists
            const parentEl = pathEl.parentNode as Element | null;
            if (parentEl) {
              d3.select(parentEl)
                .append("text")
                .attr("x", midpoint.x)
                .attr("y", midpoint.y)
                .attr("dy", "0.35em")
                .attr("text-anchor", "middle")
                .text(self.formatNumber(d.value))
                .attr("fill", "#000")
                .attr("opacity", 0)
                .transition()
                .duration(1000)
                .attr("opacity", 1);
            }
          });


        // Create a Material Design–inspired color scale for nodes
        const materialColors = [
          "#4285F4", "#DB4437", "#F4B400", "#0F9D58", "#AB47BC",
          "#00ACC1", "#FF7043", "#9E9D24", "#5C6BC0", "#8D6E63"
        ];
        const color = d3.scaleOrdinal<string, string>(materialColors);

        // Render nodes as rectangles with fade-in
        this.svg.append("g")
          .selectAll("rect")
          .data(graph.nodes)
          .enter().append("rect")
          .attr("x", (d: SankeyNode) => d.x0!)
          .attr("y", (d: SankeyNode) => d.y0!)
          .attr("height", (d: SankeyNode) => d.y1! - d.y0!)
          .attr("width", (d: SankeyNode) => d.x1! - d.x0!)
          .style("fill", (d: SankeyNode) => color(d.name))
          .style("stroke", "#ffffff")  // White stroke for a clean Material look
          .attr("opacity", 0)
          .transition()
          .duration(1000)
          .attr("opacity", 1);

        // Render node labels with fade-in
        this.svg.append("g")
          .selectAll("text")
          .data(graph.nodes)
          .enter().append("text")
          .attr("x", (d: SankeyNode) => d.x0! - 6)
          .attr("y", (d: SankeyNode) => (d.y1! + d.y0!) / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "end")
          .text((d: SankeyNode) => d.name)
          .attr("opacity", 0)
          .transition()
          .duration(1000)
          .attr("opacity", 1)
          .filter((d: SankeyNode) => d.x0! < this.width / 2)
          .attr("x", (d: SankeyNode) => d.x1! + 6)
          .attr("text-anchor", "start");
      })
      .catch((error: any) => {
        console.error("Error loading Sankey data: ", error);
      });
  }

  convertDataToNodes(data: Record<string, any>): BackendNodesData {
    if (!data || typeof data !== 'object') {
      console.error("Invalid data structure", data);
      return { nodes: [] };
    }
    const keys = Object.keys(data);
    const nodes = keys.map((key, index) => ({
      node: index,
      name: key,
      type: key.toLowerCase().includes("revenue") ? "total" : "inflow"
    }));
    return { nodes };
  }

  convertDataToLinks(data: BackendNodesData, rawData: Record<string, any>): BackendLinksData {
    const nodes = data.nodes;
    const inflows = nodes.filter(n => n.type === "inflow");
    const totals = nodes.filter(n => n.type === "total");

    let links: BackendLink[] = [];
    inflows.forEach(inflow => {
      totals.forEach(total => {
        const value = rawData[inflow.name];
        links.push({
          source: inflow.node,
          target: total.node,
          value: value !== undefined ? value : 0
        });
      });
    });
    return { links };
  }

  formatNumber(value: number): string {
    if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 2).replace(/\.00?$/, '') + 'M';
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 2).replace(/\.00?$/, '') + 'K';
    }
    return value.toString();
  }
  

}
