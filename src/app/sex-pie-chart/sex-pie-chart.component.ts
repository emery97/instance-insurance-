import { Component } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { SexService } from '../services/sex.service';

@Component({
  selector: 'app-sex-pie-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  providers: [SexService],
  templateUrl: './sex-pie-chart.component.html',
  styleUrls: ['./sex-pie-chart.component.css']
})
export class SexPieChartComponent {
  Highcharts = Highcharts;
  sexData: any = [];
  chartOptions: any = {};

  constructor(private sexService: SexService) { }

  ngOnInit() {
    this.sexService.getSexData().subscribe(data => {
      const sexGroups = data.map((item: { sex: string }) => item.sex);
      const customerCounts = data.map((item: { count: number }) => item.count);
      this.setChartOptions(sexGroups, customerCounts);
    });
  }

  setChartOptions(sexGroups: string[], customerCounts: number[]) {
    const chartData = sexGroups.map((group, index) => ({
      name: group,      // Set the name of the group
      y: customerCounts[index],  // Corresponding customer count for the group
    }));

    console.log(chartData);
    this.chartOptions = {
      chart: {
        type: 'pie',
        events: {
          render: function (this: Highcharts.Chart) {
            const series = this.series[0]; // Assuming a single series
            const points = series.points;
            points.forEach((point, index) => {
              const graphic = point.graphic;
              if (graphic) {
                // Apply custom animation for each slice
                graphic.attr({
                  opacity: 0, // Initially hide the slice
                  transform: 'scale(0.1)' // Start with a smaller scale
                }).animate({
                  opacity: 1, // Fade in
                  transform: 'scale(1)' // Scale back to normal size
                }, {
                  duration: 1000, // Duration of the animation for each slice
                  easing: 'easeOutBounce', // You can change easing method
                  // Delay to stagger the animation
                });
              }
            });
          }
        }
      },
      title: {
        text: 'Sex Pie Chart'
      },
      tooltip: {
        headerFormat: '',
        pointFormat:
          '<span style="color:{point.color}">\u25cf</span> ' +
          '{point.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          borderWidth: 2,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b><br>{point.percentage}%',
            distance: 20
          }
        }
      },
      
      series: [{
        enableMouseTracking: true,
        colorByPoint: true,
        data: [
          { name: 'male', y: 676 },
          { name: 'female', y: 662 },
        ]
      }]
    };
  }
}
