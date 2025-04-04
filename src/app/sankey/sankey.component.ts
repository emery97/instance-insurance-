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
  private width: number = 960;
  private height: number = 500;
  private animationDuration: number = 1000;

  ngOnInit(): void {
    this.svg = d3.select<SVGSVGElement, unknown>('svg');

    const sankeyGenerator = sankey<SankeyNode, SankeyLink>()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [this.width - 1, this.height - 6]]);

    Promise.all([
      d3.json("http://localhost:3000/insurance/sankey-revenue"),
      d3.json("http://localhost:3000/insurance/sankey-expenses")
    ]).then(([revenueData, expensesData]: [any, any]) => {
      // Process revenue data
      const revenueObj: Record<string, any> = Array.isArray(revenueData) ? revenueData[0] : revenueData;
      const revenueNodes: BackendNodesData = this.convertDataToNodes(revenueObj);
      const revenueLinks: BackendLinksData = this.convertDataToLinks(revenueNodes, revenueObj);

      // Process expenses data
      const expensesObj: Record<string, any> = Array.isArray(expensesData) ? expensesData[0] : expensesData;
      const expensesNodes: BackendNodesData = this.convertDataToNodes(expensesObj);
      const expensesLinks: BackendLinksData = this.convertDataToLinks(expensesNodes, expensesObj);

      // Sort revenue nodes alphabetically
      const sortedRevenueNodes = revenueNodes.nodes.sort((a, b) => a.name.localeCompare(b.name));

      // Sort expense nodes alphabetically, but keep "expenses" node separate
      let expensesTotalNode = expensesNodes.nodes.find(n => n.name === 'expenses');
      let otherExpenseNodes = expensesNodes.nodes.filter(n => n.name !== 'expenses')
        .sort((a, b) => a.name.localeCompare(b.name));

      // Merge with revenue nodes first, then place "expenses" at index 4, followed by other expenses
      let sortedNodes = [
        ...sortedRevenueNodes,    // Revenue nodes first
        expensesTotalNode,        // "expenses" node at index 4
        ...otherExpenseNodes      // Other expense nodes after
      ];

      // Re-index nodes to maintain consistency
      sortedNodes.forEach((node, index) => {
        if (node) {
          node.node = index; // Update node index to be sequential
        }
      });

      // Adjust links to reflect new indices
      const updateLinks = (links: BackendLinksData, oldNodes: BackendNodesData) => {
        return links.links.map(link => {
          const newSourceNode = sortedNodes.find(n => n && n.name === oldNodes.nodes[link.source]?.name);
          const newTargetNode = sortedNodes.find(n => n && n.name === oldNodes.nodes[link.target]?.name);

          if (!newSourceNode || !newTargetNode) {
            console.warn(`Missing node mapping for link:`, link);
            return null; // Skip invalid links
          }

          return { ...link, source: newSourceNode.node, target: newTargetNode.node };
        }).filter(link => link !== null); // Remove any invalid links
      };


      const updatedRevenueLinks = updateLinks(revenueLinks, revenueNodes);
      const updatedExpensesLinks = updateLinks(expensesLinks, expensesNodes);

      // Combined results
      console.log("Sorted Merged Nodes (Revenue First, Expenses at Index 4): ", sortedNodes);
      console.log("Updated Revenue Links: ", updatedRevenueLinks);
      console.log("Updated Expenses Links: ", updatedExpensesLinks);

      // Compute node and link positions
      const graph: SankeyGraph<SankeyNode, SankeyLink> = sankeyGenerator({
        nodes: revenueNodes.nodes.map(d => ({ ...d })),
        links: revenueLinks.links.map(d => ({ ...d }))
      });

      // Compute percentages for link labels
      const graphLinksWithPercentages = this.computeLinkPercentages(
        revenueLinks.links.map(link => ({
          source: typeof link.source === 'number' ? link.source : 0,
          target: typeof link.target === 'number' ? link.target : 0,
          value: link.value.toString()
        }))
      );
      // Render the chart parts
      this.renderLinks(graph, graphLinksWithPercentages);
      this.renderNodes(graph);
      this.renderNodeLabels(graph);
    })
      .catch((error: any) => {
        console.error("Error loading Sankey data: ", error);
      });
  }

  private renderLinks(
    graph: SankeyGraph<SankeyNode, SankeyLink>,
    graphLinksWithPercentages: { source: number; target: number; value: number; percentageFromSource: string }[]
  ): void {
    // Define the same color scale used in renderNodes for consistency
    const materialColors: string[] = [
      "#4285F4", "#DB4437", "#F4B400", "#0F9D58", "#AB47BC",
      "#00ACC1", "#FF7043", "#9E9D24", "#5C6BC0", "#8D6E63"
    ];
    const color = d3.scaleOrdinal<string, string>(materialColors);
    
    const linkGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any> = this.svg.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.4); // Increased opacity a bit from 0.2
    
    linkGroup.selectAll("path")
      .data(graph.links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", sankeyLinkHorizontal())
      .style("stroke-width", (d: SankeyLink) => Math.max(1, d.width!))
      // Get color from source node
      .style("stroke", (d: SankeyLink) => {
        // Get the source node to determine its color
        const source = typeof d.source === 'object' ? d.source : null;
        return source && 'name' in source 
          ? color((source as SankeyNode).name) 
          : "#757575"; // Fallback color
      })
      .attr("opacity", 0)
      .transition()
      .duration(this.animationDuration)
      .attr("opacity", 1)
      .on("end", (d: SankeyLink, i: number, nodes: ArrayLike<SVGPathElement>) => {
        const pathEl: SVGPathElement = nodes[i];
        const totalLength: number = pathEl.getTotalLength();
        const midpoint: DOMPoint = pathEl.getPointAtLength(totalLength / 2);
        const parentEl: Element | null = pathEl.parentNode as Element | null;
        if (parentEl) {
          const sourceIndex: number = (typeof d.source === 'object' && d.source !== null && 'index' in d.source)
            ? (d.source as any).index
            : d.source as number;
          const targetIndex: number = (typeof d.target === 'object' && d.target !== null && 'index' in d.target)
            ? (d.target as any).index
            : d.target as number;
          const percentage: string = graphLinksWithPercentages.find(link => {
            return link.source === sourceIndex && link.target === targetIndex;
          })?.percentageFromSource || '0%';
  
          d3.select(parentEl)
            .append("text")
            .attr("x", midpoint.x)
            .attr("y", midpoint.y)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(`${this.formatNumber(d.value)} (${percentage})`)
            .attr("fill", "#000")
            .attr("opacity", 0)
            .transition()
            .duration(this.animationDuration)
            .attr("opacity", 1);
        }
      });
  }

  private renderNodes(graph: SankeyGraph<SankeyNode, SankeyLink>): void {
    const materialColors: string[] = [
      "#4285F4", "#DB4437", "#F4B400", "#0F9D58", "#AB47BC",
      "#00ACC1", "#FF7043", "#9E9D24", "#5C6BC0", "#8D6E63"
    ];
    const color = d3.scaleOrdinal<string, string>(materialColors);

    this.svg.append("g")
      .selectAll("rect")
      .data(graph.nodes)
      .enter().append("rect")
      .attr("x", (d: SankeyNode): number => d.x0!)
      .attr("y", (d: SankeyNode): number => d.y0!)
      .attr("height", (d: SankeyNode): number => d.y1! - d.y0!)
      .attr("width", (d: SankeyNode): number => d.x1! - d.x0!)
      .style("fill", (d: SankeyNode): string => color(d.name))
      .style("stroke", "#ffffff")
      .attr("opacity", 0)
      .transition()
      .duration(this.animationDuration)
      .attr("opacity", 1);
  }

  private renderNodeLabels(graph: SankeyGraph<SankeyNode, SankeyLink>): void {
    this.svg.append("g")
      .selectAll("text")
      .data(graph.nodes)
      .enter().append("text")
      .attr("x", (d: SankeyNode): number => d.x0! - 6)
      .attr("y", (d: SankeyNode): number => (d.y1! + d.y0!) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text((d: SankeyNode): string => {
        const formattedName = d.name.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
        return formattedName;
      })
      .attr("opacity", 0)
      .transition()
      .duration(this.animationDuration)
      .attr("opacity", 1)
      .filter((d: SankeyNode): boolean => d.x0! < this.width / 2)
      .attr("x", (d: SankeyNode): number => d.x1! + 6)
      .attr("text-anchor", "start");
  }

  private convertDataToNodes(data: Record<string, any>): BackendNodesData {
    if (!data || typeof data !== 'object') {
      console.error("Invalid data structure", data);
      return { nodes: [] };
    }
    const keys: string[] = Object.keys(data);
    const nodes: BackendNode[] = keys.map((key: string, index: number) => ({
      node: index,
      name: key,
      type: key.toLowerCase().includes("revenue") ? "total" : "inflow"
    }));
    return { nodes };
  }

  private convertDataToLinks(data: BackendNodesData, rawData: Record<string, any>): BackendLinksData {
    const nodes: BackendNode[] = data.nodes;
    const inflows: BackendNode[] = nodes.filter((n: BackendNode) => n.type === "inflow");
    const totals: BackendNode[] = nodes.filter((n: BackendNode) => n.type === "total");

    const links: BackendLink[] = [];
    inflows.forEach((inflow: BackendNode): void => {
      totals.forEach((total: BackendNode): void => {
        const value: number = rawData[inflow.name];
        links.push({
          source: inflow.node,
          target: total.node,
          value: value !== undefined ? value : 0
        });
      });
    });
    return { links };
  }

  private formatNumber(value: number): string {
    if (value >= 1_000_000) {
      return (value / 1_000_000)
        .toFixed(value % 1_000_000 === 0 ? 0 : 2)
        .replace(/\.00?$/, '') + 'M';
    } else if (value >= 1_000) {
      return (value / 1_000)
        .toFixed(value % 1_000 === 0 ? 0 : 2)
        .replace(/\.00?$/, '') + 'K';
    }
    return value.toString();
  }

  private computeLinkPercentages(links: { source: number; target: number; value: string }[]): {
    source: number;
    target: number;
    value: number;
    percentageFromSource: string;
  }[] {
    const targetTotals: { [key: number]: number } = {};
    links.forEach((link: { source: number; target: number; value: string }): void => {
      const target: number = link.target;
      const value: number = parseFloat(link.value);
      if (!targetTotals[target]) {
        targetTotals[target] = 0;
      }
      targetTotals[target] += value;
    });
    return links.map((link: { source: number; target: number; value: string }) => {
      const value: number = parseFloat(link.value);
      const total: number = targetTotals[link.target];
      const percentage: number = total ? (value / total) * 100 : 0;
      return {
        ...link,
        value: value,
        percentageFromSource: percentage.toFixed(2) + '%'
      };
    });
  }
}
