import {  Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HighchartsDashboardComponent } from './highcharts-dashboard/highcharts-dashboard.component';   
import { SankeyComponent } from './sankey/sankey.component';

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
    {
        path:'financial-sankey',
        component: SankeyComponent,
        title : 'Financial Sankey Page',
    },
];

export default routes;