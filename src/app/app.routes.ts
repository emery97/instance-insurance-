import {  Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HighchartsDashboardComponent } from './highcharts-dashboard/highcharts-dashboard.component';   

const routes:Routes = [
    {
        path:'',
        component: LandingPageComponent,
        title : 'Landing Page',
    },
    {
        path:'dashboard',
        component: DashboardComponent,
        title : 'Dashboard Page',
    },
    {
        path:'highcharts-dashboard',
        component: HighchartsDashboardComponent,
        title : 'Highcharts Dashboard Page',
    },
];

export default routes;