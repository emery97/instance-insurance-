import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { sankey as d3Sankey, SankeyLayout } from 'd3-sankey';

interface SankeyNode {
  node: number;
  name: string;
}

interface SankeyData {
  nodes: SankeyNode[];
}

@Component({
  selector: 'app-sankey',
  imports: [],
  templateUrl: './sankey.component.html',
  styleUrl: './sankey.component.css'
})


export class SankeyComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    Promise.all([
      d3.json("http://localhost:3000/insurance/premium"),
      d3.json("http://localhost:3000/insurance/investment"),
      d3.json("http://localhost:3000/insurance/contract-lump-sum"),
      d3.json("http://localhost:3000/insurance/profit")
    ]).then(
      ([insurancePremium, investmentIncome, contractLS, profit]: [any, any, any, any]): void => {
        var data = [insurancePremium[0], investmentIncome[0], contractLS[0], profit[0]];
        console.log("data: ", data);
              // Extract names safely, ignoring undefined values
      const names = data
      .filter(item => item && item.name) // Remove undefined or null items
      .map((item: any) => item.name);

    console.log("Extracted names:", names);
    
        var nodes = this.createSankeyData(data.map((item: any) => item.name));
        console.log("nodes", nodes);  

        var links = [{}];

        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 10, bottom: 10, left: 10 },
          width = 450 - margin.left - margin.right,
          height = 480 - margin.top - margin.bottom;
      }
    );
  }

  createSankeyData(array: string[]): SankeyData {
    console.log("array", array);  
    array.forEach(element => {
      console.log("value : ",element);
    });
    return {
      nodes: array.map((item: string, index: number): SankeyNode => ({
        node: index, // Assign index as the node number
        name: item // Use item as the name
      }))
    };
  }
}
