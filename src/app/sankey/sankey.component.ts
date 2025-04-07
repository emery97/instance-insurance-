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
  node?: number;  // for indexing
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
  // Define a component-level color scale that will be set after merging nodes.
  private color!: d3.ScaleOrdinal<string, string>;

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
      const revenueObj = Array.isArray(revenueData) ? revenueData[0] : revenueData;
      const revenueNodesData: BackendNodesData = this.convertDataToNodes(revenueObj);
      const revenueLinksData: BackendLinksData = this.convertDataToLinks(revenueNodesData, revenueObj);

      console.log("Revenue Nodes Data:", revenueNodesData);
      console.log("Revenue Links Data:", revenueLinksData);
      // Process expenses data
      const expensesObj = Array.isArray(expensesData) ? expensesData[0] : expensesData;
      const expensesNodesData: BackendNodesData = this.convertDataToNodes(expensesObj);
      const expensesLinksData: BackendLinksData = this.convertDataToLinks(expensesNodesData, expensesObj);

      console.log("Expenses Nodes Data:", expensesNodesData);
      console.log("Expenses Links Data:", expensesLinksData);

      // Separate revenue nodes into inflows and the revenue total.
      const revenueTotalNode = revenueNodesData.nodes.find(n => n.name === 'revenue');
      const revenueInflowNodes = revenueNodesData.nodes.filter(n => n.name !== 'revenue');

      // Separate expense nodes into the main "expenses" node and the expense type nodes.
      const expenseTotalNode = expensesNodesData.nodes.find(n => n.name === 'expenses');
      const expenseTypeNodes = expensesNodesData.nodes.filter(n => n.name !== 'expenses');

      // Merge nodes in the correct order:
      // Revenue inflows -> Revenue total -> Expenses total -> Expense type nodes
      let mergedNodes = [
        ...revenueInflowNodes,
        revenueTotalNode,
        expenseTotalNode,
        ...expenseTypeNodes
      ].filter(node => node !== undefined) as BackendNode[];

      // Re-index nodes so that index order reflects the layout order.
      mergedNodes.forEach((node, index) => {
        node.node = index;
      });

      // Create a common color scale using a preset range and the merged node names.
      const materialColors: string[] = [
        "#4285F4", "#DB4437", "#F4B400", "#0F9D58", "#AB47BC",
        "#00ACC1", "#FF7043", "#9E9D24", "#5C6BC0", "#8D6E63"
      ];
      this.color = d3.scaleOrdinal<string, string>()
        .domain(mergedNodes.map(n => n.name))
        .range(materialColors);

      // Function to update links using new indices based on node names.
      const updateLinks = (
        links: BackendLinksData,
        oldNodes: BackendNodesData
      ): BackendLinksData => {
        return {
          links: links.links.map(link => {
            const newSourceNode = mergedNodes.find(n => n.name === oldNodes.nodes[link.source]?.name);
            const newTargetNode = mergedNodes.find(n => n.name === oldNodes.nodes[link.target]?.name);

            if (!newSourceNode || !newTargetNode) {
              console.warn(`Missing node mapping for link:`, link);
              return null; // Skip invalid links
            }

            return {
              ...link,
              source: newSourceNode.node,
              target: newTargetNode.node,
              value: link.value
            };
          }).filter(link => link !== null) as BackendLink[]
        };
      };

      // Update revenue links with new indices.
      const updatedRevenueLinks = updateLinks(revenueLinksData, revenueNodesData);

      // Create dynamic expense links using actual expense values:
      // Link from revenue total node to expense total node
      // then from expense total node to each expense type node.
      const dynamicExpenseLinks: BackendLink[] = [];
      if (revenueTotalNode && expenseTotalNode) {
        dynamicExpenseLinks.push({
          source: revenueTotalNode.node,
          target: expenseTotalNode.node,
          value: expensesObj['expenses'] || 0
        });
      }
      expenseTypeNodes.forEach(expense => {
        dynamicExpenseLinks.push({
          source: expenseTotalNode!.node,
          target: expense.node,
          value: expensesObj[expense.name] || 0
        });
      });

      // Combine the revenue links and expense links.
      const combinedLinks = [
        ...updatedRevenueLinks.links,
        ...dynamicExpenseLinks
      ];

      console.log("Merged Nodes (ordered):", mergedNodes);
      console.log("Updated Revenue Links:", updatedRevenueLinks);
      console.log("Dynamic Expense Links:", dynamicExpenseLinks);
      console.log("Combined Links:", combinedLinks);

      // Build the graph using the merged nodes and combined links.
      const graph: SankeyGraph<SankeyNode, SankeyLink> = sankeyGenerator({
        nodes: mergedNodes.map(d => ({ ...d })),
        links: combinedLinks.map(d => ({ ...d }))
      });

      // Compute percentages for link labels using combined links.
      const graphLinksWithPercentages = this.computeLinkPercentages(
        combinedLinks.map(link => ({
          source: typeof link.source === 'number' ? link.source : 0,
          target: typeof link.target === 'number' ? link.target : 0,
          value: link.value.toString()
        }))
      );

      // Render the chart parts using the updated graph.
      this.renderLinks(graph, graphLinksWithPercentages);
      this.renderNodes(graph);
    })
      .catch((error: any) => {
        console.error("Error loading Sankey data: ", error);
      });
  }

  private renderLinks(
    graph: SankeyGraph<SankeyNode, SankeyLink>,
    graphLinksWithPercentages: { source: number; target: number; value: number; percentageFromSource: string }[]
  ): void {
    // Use the common color scale (this.color) defined earlier.
    const defs = this.svg.append("defs");

    const linkGroup = this.svg.append("g")
      .attr("fill", "none")
      .attr("stroke-opacity", 0.4);

    linkGroup.selectAll("path")
      .data(graph.links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", sankeyLinkHorizontal())
      .style("stroke-width", (d: SankeyLink) => Math.max(1, d.width!))
      .style("stroke", (d: SankeyLink, i: number) => {
        const source = typeof d.source === 'object' ? d.source as SankeyNode : null;
        const target = typeof d.target === 'object' ? d.target as SankeyNode : null;
        // Fallback color in case source/target not available.
        const sourceColor = source ? this.color(source.name) : "#757575";
        const targetColor = target ? this.color(target.name) : "#757575";

        // Create a unique id for the gradient.
        const gradientID = `gradient${i}`;
        const gradient = defs.append("linearGradient")
          .attr("id", gradientID)
          .attr("gradientUnits", "userSpaceOnUse");

        // Set gradient start and end positions based on link positions.
        if (source && target) {
          gradient
            .attr("x1", source.x1!)
            .attr("y1", (source.y0! + source.y1!) / 2)
            .attr("x2", target.x0!)
            .attr("y2", (target.y0! + target.y1!) / 2);
        } else {
          // Fallback positions.
          gradient
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 1)
            .attr("y2", 0);
        }

        // Define gradient stops.
        gradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", sourceColor);
        gradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", targetColor);

        return `url(#${gradientID})`;
      })
      .attr("opacity", 0)
      .transition()
      .duration(this.animationDuration)
      .attr("opacity", 1)
      .on("end", (d: SankeyLink, i: number, nodes: ArrayLike<SVGPathElement>) => {
        const pathEl = nodes[i];
        const totalLength = pathEl.getTotalLength();
        const midpoint = pathEl.getPointAtLength(totalLength / 2);
        const parentEl = pathEl.parentNode as Element | null;
        if (parentEl) {
          // Retrieve source and target names.
          const sourceNode = typeof d.source === 'object' ? d.source as SankeyNode : null;
          const targetNode = typeof d.target === 'object' ? d.target as SankeyNode : null;
          const sourceName = sourceNode ? sourceNode.name : "";
          const targetName = targetNode ? targetNode.name : "";
      
          // Look up percentage (if not found, default to '0%').
          const sourceIndex: number = (typeof d.source === 'object' && d.source !== null && 'index' in d.source)
            ? (d.source as any).index
            : d.source as number;
          const targetIndex: number = (typeof d.target === 'object' && d.target !== null && 'index' in d.target)
            ? (d.target as any).index
            : d.target as number;
          const percentage: string = graphLinksWithPercentages.find(link =>
            link.source === sourceIndex && link.target === targetIndex
          )?.percentageFromSource || '0%';
      
          // Define a horizontal offset to place the text to the right of the link.
          const offset = 10;
      
          // Create a text element and append three tspans for multi-line text.
          const text = d3.select(parentEl)
            .append("text")
            .attr("x", midpoint.x + offset)  // move text to the right
            .attr("y", midpoint.y)
            .attr("text-anchor", "start")    // align text to the left
            .attr("opacity", 0);
      
          // First row: edge name (e.g., "Source -> Target")
          text.append("tspan")
            .text(sourceName
              .replace(/_/g, ' ')
              .replace(/\b\w/g, char => char.toUpperCase()))
            .attr("x", midpoint.x + offset)
            .attr("dy", "-1.2em")
            .style("font-size", "10px"); // smaller font
      
          // Second row: value
          text.append("tspan")
            .text(`${this.formatNumber(d.value)}`)
            .attr("x", midpoint.x + offset)
            .attr("dy", "1.2em")
            .style("font-size", "10px");
      
          // Third row: percentage in brackets
          text.append("tspan")
            .text(`(${percentage})`)
            .attr("x", midpoint.x + offset)
            .attr("dy", "1.2em")
            .style("font-size", "10px");
      
          // Fade in the label.
          text.transition()
            .duration(this.animationDuration)
            .attr("opacity", 1)
            .attr("fill", "#000");
        }
      });
  }

  private renderNodes(graph: SankeyGraph<SankeyNode, SankeyLink>): void {
    // Render node rectangles
    this.svg.append("g")
      .selectAll("rect")
      .data(graph.nodes)
      .enter().append("rect")
      .attr("x", (d: SankeyNode) => d.x0!)
      .attr("y", (d: SankeyNode) => d.y0!)
      .attr("height", (d: SankeyNode) => d.y1! - d.y0!)
      .attr("width", (d: SankeyNode) => d.x1! - d.x0!)
      .style("fill", (d: SankeyNode) => this.color(d.name))
      .style("stroke", "#ffffff")
      .attr("opacity", 0)
      .transition()
      .duration(this.animationDuration)
      .attr("opacity", 1);

    // Append text labels to nodes with smaller font size and formatted names.
    this.svg.append("g")
      .selectAll("text")
      .data(graph.nodes)
      .enter().append("text")
      .attr("x", (d: SankeyNode) => d.x0! - 6) // adjust horizontal position as needed
      .attr("y", (d: SankeyNode) => (d.y0! + d.y1!) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(d => this.formatNodeName(d.name))
      .style("font-size", "10px");  // decrease font size as desired
  }

  private convertDataToNodes(data: Record<string, any>): BackendNodesData {
    if (!data || typeof data !== 'object') {
      console.error("Invalid data structure", data);
      return { nodes: [] };
    }
    const keys = Object.keys(data);
    const nodes: BackendNode[] = keys.map((key, index) => ({
      node: index,
      name: key,
      type: key.toLowerCase().includes("revenue") ? "total" : "inflow"
    }));
    return { nodes };
  }

  private convertDataToLinks(data: BackendNodesData, rawData: Record<string, any>): BackendLinksData {
    const nodes = data.nodes;
    const inflows = nodes.filter(n => n.type === "inflow");
    const totals = nodes.filter(n => n.type === "total");

    const links: BackendLink[] = [];
    inflows.forEach((inflow) => {
      totals.forEach((total) => {
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
  private formatNodeName(name: string): string {
    return name.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }


  private computeLinkPercentages(links: { source: number; target: number; value: string }[]): {
    source: number;
    target: number;
    value: number;
    percentageFromSource: string;
  }[] {
    const targetTotals: { [key: number]: number } = {};
    links.forEach(link => {
      const target = link.target;
      const value = parseFloat(link.value);
      targetTotals[target] = (targetTotals[target] || 0) + value;
    });
    return links.map(link => {
      const value = parseFloat(link.value);
      const total = targetTotals[link.target];
      const percentage = total ? (value / total) * 100 : 0;
      return {
        ...link,
        value: value,
        percentageFromSource: percentage.toFixed(2) + '%'
      };
    });
  }
}
