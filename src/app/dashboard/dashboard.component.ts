import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent],
  template: `
    <app-header></app-header>
    <h1>Insurance Dashboard</h1>
  `,
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
