import { Component } from '@angular/core';
import { BmiService } from '../services/bmi.service';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-bmi-drill-down',
  imports: [
    HighchartsChartModule,
  ],
  providers: [BmiService],
  templateUrl: './bmi-drill-down.component.html',
  styleUrl: './bmi-drill-down.component.css'
})
export class BmiDrillDownComponent {

}
