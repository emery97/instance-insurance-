import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { sankey as d3Sankey, SankeyLayout } from 'd3-sankey';

interface SankeyNode {
  node: number;
  name: string;
  type: string; // Adding type to ensure type is also passed
}

interface SankeyData {
  nodes: SankeyNode[];
}

@Component({
  selector: 'app-sankey',
  templateUrl: './sankey.component.html',
  styleUrls: ['./sankey.component.css']
})
export class SankeyComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    Promise.all([
      d3.json("http://localhost:3000/insurance/sankey"),
    ]).then(([insuranceData]: [any]): void => {

      // Check if insuranceData is an array and extract the first object if needed
      const dataObject = Array.isArray(insuranceData) ? insuranceData[0] : insuranceData;

      const nodes = this.convertDataToNodes(dataObject);
      console.log("Nodes: ", nodes);

      // Pass the entire nodes object (not just the first element)
      const links = this.convertDataToLinks(nodes);
      console.log("Links: ", links);

      var margin = { top: 10, right: 10, bottom: 10, left: 10 },
          width = 450 - margin.left - margin.right,
          height = 480 - margin.top - margin.bottom;
    });
  }

  convertDataToNodes(data: Record<string, string>): { nodes: { node: number; name: string; type: string }[] } {
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

  convertDataToLinks(data: { nodes: { node: number; name: string; type: string }[] }): { links: { source: number; target: number; value: number }[] } {
    const nodes = data.nodes; // Accessing nodes from the entire data object

    const inflows = nodes.filter(n => n.type === "inflow"); // Nodes of type "inflow"
    const totals = nodes.filter(n => n.type === "total");   // Nodes of type "total"

    let links: { source: number; target: number; value: number }[] = [];

    // Link each inflow node to all total nodes
    inflows.forEach(inflow => {
      totals.forEach(total => {
        links.push({
          source: inflow.node,
          target: total.node,
          value: 2
        });
      });
    });

    return { links };
  }
}
