import { Component, OnInit } from '@angular/core';
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
export class SexPieChartComponent implements OnInit {
  Highcharts = Highcharts;
  chartOptions: any = {};

  constructor(private sexService: SexService) {}

  ngOnInit() {
    this.sexService.getSexData().subscribe(data => {
      const sexGroups = data.map((item: { sex: string }) => item.sex);
      const customerCounts = data.map((item: { count: number }) => item.count);
      this.setChartOptions(sexGroups, customerCounts);

      // Trigger reflow after a slight delay
      setTimeout(() => {
        const chart = Highcharts.chart('sex-pie-chart', this.chartOptions); // Access chart by ID with options
        if (chart) {
          chart.reflow();
        }
      }, 100);
    });
  }

  setChartOptions(sexGroups: string[], customerCounts: number[]) {
    const chartData = sexGroups.map((group, index) => ({
      name: group,
      y: Number(customerCounts[index])
    }));

    this.chartOptions = {
      chart: {
        type: 'pie',
        events: {
          render: function (this: Highcharts.Chart) {
            const series = this.series[0]; 
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
        text: 'Gender Distribution Pie Chart'
      },
      tooltip: {
        headerFormat: '',
        pointFormat:
          '<span style="color:{point.color}">\u25cf</span> ' +
          '{point.name}: <b>{point.percentage:.1f}%</b>' // Format to 1 decimal place
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
            format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
            distance: 20
          }
        }
      },
      
      series: [{
        enableMouseTracking: true,
        colorByPoint: true,
        data: chartData
      }]
    };
  }
}
