import { Component } from '@angular/core';
import { FemaleBmiService } from '../services/female-bmi.service';
import { MaleBmiService } from '../services/male-bmi.service';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-bmi-vs-age-scatter-plot',
  imports: [
    HighchartsChartModule,
  ],
  providers: [
    FemaleBmiService,
    MaleBmiService,
  ],
  templateUrl: './bmi-vs-age-scatter-plot.component.html',
  styleUrl: './bmi-vs-age-scatter-plot.component.css'
})
export class BmiDrillDownComponent {
  Highcharts = Highcharts;
  chartOptions: any = {};

  constructor(
    private femaleBmiService: FemaleBmiService,
    private maleBmiService: MaleBmiService
  ) {}

  ngOnInit() {
    forkJoin({
      femaleData: this.femaleBmiService.getFemaleBmiData(),
      maleData: this.maleBmiService.getMaleBmiData()
    }).subscribe(({ femaleData, maleData }) => {
      const femaleAge = femaleData.map((item: any) => Number(item.age));
      const femaleBmi = femaleData.map((item: any) => Number(item.bmi));
  
      const maleAge = maleData.map((item: any) => Number(item.age));
      const maleBmi = maleData.map((item: any) => Number(item.bmi));
  
      this.setChartOptions(femaleAge, femaleBmi, maleAge, maleBmi);
  
      setTimeout(() => {
        const chart = Highcharts.chart('bmi-age-scatter-plot', this.chartOptions);
        if (chart) {
          chart.reflow();
        }
      }, 100);
    });
  }
  

  calculateBestFitLine(age: number[], bmi: number[]) {
    const n = age.length;
    const sumX = age.reduce((acc, val) => acc + val, 0);
    const sumY = bmi.reduce((acc, val) => acc + val, 0);
    const sumXY = age.reduce((acc, val, i) => acc + val * bmi[i], 0);
    const sumX2 = age.reduce((acc, val) => acc + val * val, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const minX = Math.min(...age);
    const maxX = Math.max(...age);

    return [
      [minX, slope * minX + intercept],
      [maxX, slope * maxX + intercept]
    ];
  }

  setChartOptions(femaleAge: number[], femaleBmi: number[], maleAge: number[], maleBmi: number[]) {
    const femaleTrendLine = this.calculateBestFitLine(femaleAge, femaleBmi);
    const maleTrendLine = this.calculateBestFitLine(maleAge, maleBmi);

    this.chartOptions = {
      chart: {
        type: 'scatter',
        zoomType: 'xy'
      },
      title: {
        text: 'BMI vs Age Scatter Plot'
      },
      subtitle: {
        text: 'To improve clarity and focus on the female data, we recommend temporarily disabling the display of male data points'
      },
      xAxis: {
        title: { text: 'Age' },
        labels: { format: '{value} years' },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
      },
      yAxis: {
        title: { text: 'BMI' },
        labels: { format: '{value} kg/m²' }
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 2.5,
            symbol: 'circle',
            states: { hover: { enabled: true } }
          },
          states: { hover: { marker: { enabled: false } } },
          jitter: { x: 0.1, y:0.1 }
        }
      },
      tooltip: {
        pointFormat: 'Age: {point.x} years <br/> BMI: {point.y} kg/m²'
      },
      series: [
        {
          name: 'Female BMI vs Age',
          color: '#FF5376',
          data: femaleAge.map((age, index) => [age, femaleBmi[index]]),
          marker: {
            symbol: 'circle', // Female points as circles
            radius: 4
          },
        },
        {
          name: 'Female Line of Best Fit',
          type: 'line',
          color: '#F8C0C8',
          data: femaleTrendLine,
          marker: { enabled: false },
          enableMouseTracking: false,
          dashStyle: 'Solid'
        },
        {
          name: 'Male BMI vs Age',
          color: '#7DE2D1',
          data: maleAge.map((age, index) => [age, maleBmi[index]]),
          marker: {
            symbol: 'triangle', // Male points as triangles
            radius: 4
          },
        },
        {
          name: 'Male Line of Best Fit',
          type: 'line',
          color: '#339989',
          data: maleTrendLine,
          marker: { enabled: false },
          enableMouseTracking: false,
          dashStyle: 'Dash'
        }
      ]
    };
  }
}
