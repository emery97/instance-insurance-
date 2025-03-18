import { Component } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { SexService } from '../services/sex.service';

@Component({
  selector: 'app-sex-pie-chart',
  imports: [
    HighchartsChartModule,
  ],
  providers: [
    SexService
  ],
  templateUrl: './sex-pie-chart.component.html',
  styleUrl: './sex-pie-chart.component.css'
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
    this.chartOptions = {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Departmental Strength of a Company'
      },
      subtitle: {
        text: 'Custom animation of pie series'
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
        // Disable mouse tracking on load, enable after custom animation
        enableMouseTracking: false,
        animation: {
          duration: 2000
        },
        colorByPoint: true,
        data: [{
          name: 'Customer Support',
          y: 21.3
        }, {
          name: 'Development',
          y: 18.7
        }, {
          name: 'Sales',
          y: 20.2
        }, {
          name: 'Marketing',
          y: 14.2
        }, {
          name: 'Other',
          y: 25.6
        }]
      }]
    }
  }
}
