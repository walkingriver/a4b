import { Component } from '@angular/core';
import { LoginComponent } from './login.component';
import { RouterLinkWithHref } from '@angular/router';
import { GuardedComponent } from './guarded.component';

@Component({
  selector: 'route-guard-landing',
  imports: [
    GuardedComponent,
    LoginComponent,
    RouterLinkWithHref
  ],
  standalone: true,
  template: `
<h1>Guardians of the Angular Route Demo</h1>
<p>Welcome to the Angular Router Guard demo! Here you can explore how Angular's Router Guards work to secure navigation within an application.</p>

<p>This demo includes:</p>
<ul>
  <li>A fake login form to simulate user authentication.</li>
  <li>A single guarded route that checks authentication status.</li>
  <li>An alert message if login fails.</li>
  <li>A landing page to guide you through the demo and show the login state.</li>
</ul>

<p><a [routerLink]="['/','guarded-route']">Click here</a> to try navigating directly to the guarded route. Nothing will happen if you aren't logged in.</p>

<app-login />

<p>Feel free to explore and see how Router Guards can be used to control navigation within an Angular application.</p>
    `
})
export class RouteGuardLandingComponent {
}
