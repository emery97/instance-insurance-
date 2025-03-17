import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router'; // Provide the Router configuration
import routeConfig from './app/app.routes'; // Import your routes configuration
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routeConfig), // Provide the routing configuration here
    provideHttpClient(), // Provide the HTTP client (if necessary)
  ],
}).catch((err) => console.error(err));
