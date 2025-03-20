import { Component } from '@angular/core';
import { FemaleBmiService } from '../services/female-bmi.service';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-bmi-drill-down',
  imports: [
    HighchartsChartModule,
  ],
  providers: [FemaleBmiService],
  templateUrl: './bmi-drill-down.component.html',
  styleUrl: './bmi-drill-down.component.css'
})
export class BmiDrillDownComponent {
  Highcharts = Highcharts;
  bmiData: any = [];
  chartOptions: any = {};
  constructor(private femaleBmiService: FemaleBmiService) { }

  ngOnInit() {
    this.femaleBmiService.getFemaleBmiData().subscribe(data => {
      const age = data.map((item: any) => Number(item.age));
      const bmi = data.map((item: any) => Number(item.bmi));
      this.setChartOptions(age, bmi);
      setTimeout(() => {
        const chart = Highcharts.chart('bmi-age-scatter-plot', this.chartOptions);
        if (chart) {
          chart.reflow();
        }
      }, 100);
    });
  }

  setChartOptions(age: number[], bmi: number[]) {
    // Calculate linear regression (least squares method)
    const n = age.length;
    const sumX = age.reduce((acc, val) => acc + val, 0);
    const sumY = bmi.reduce((acc, val) => acc + val, 0);
    const sumXY = age.reduce((acc, val, i) => acc + val * bmi[i], 0);
    const sumX2 = age.reduce((acc, val) => acc + val * val, 0);
  
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
  
    // Generate best fit line points
    const minX = Math.min(...age);
    const maxX = Math.max(...age);
    const trendLine = [
      [minX, slope * minX + intercept],
      [maxX, slope * maxX + intercept]
    ];
  
    this.chartOptions = {
      chart: {
        type: 'scatter',
        zoomType: 'xy'
      },
      title: {
        text: 'BMI vs Age Scatter Plot'
      },
      xAxis: {
        title: {
          enabled: true,
          text: 'Age'
        },
        labels: {
          format: '{value} years'
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
      },
      yAxis: {
        title: {
          text: 'BMI'
        },
        labels: {
          format: '{value} kg/m² '
        }
      },
      plotOptions: {
        scatter: {
          marker: {
            radius: 2.5,
            symbol: 'circle',
            states: {
              hover: {
                enabled: true,
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: false
              }
            }
          },
          jitter: {
            x: 0.005
          }
        }
      },
      tooltip: {
        pointFormat: 'Age: {point.x} years <br/> BMI: {point.y} kg/m²'
      },
      series: [
        {
          name: 'Female BMI vs Age',
          color: '#FF5376', // Same color scheme as before
          data: age.map((age, index) => [age, bmi[index]])
        },
        {
          name: 'Female Line of Best Fit',
          type: 'line',
          color: '#F8C0C8', 
          data: trendLine,
          marker: {
            enabled: false
          },
          enableMouseTracking: false,
          dashStyle: 'Dash' 
        }
      ]
    };
  }  
}
