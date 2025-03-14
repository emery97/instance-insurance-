import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
  ],
  template: `
    <header>
      <div class="logo">
        <h1>Instant Insurance</h1>
      </div>

      <nav>
        <ul>
          <li><a href="home">Home</a></li>
          <li><a href="dashboard" [routerLink]="['dashboard']">Dashboard</a></li>
        </ul>
      </nav>
    </header>
  `,
  styleUrl: './header.component.css',
})
export class HeaderComponent {}
