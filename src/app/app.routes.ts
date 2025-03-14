import {  Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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
];

export default routes;