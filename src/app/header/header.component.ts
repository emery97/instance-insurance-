import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
  ],
  templateUrl: './header.component.html',  // Updated to refer to external HTML file
  styleUrls: ['./header.component.css'],  // Ensure you use 'styleUrls' for the external CSS file
})
export class HeaderComponent {}
