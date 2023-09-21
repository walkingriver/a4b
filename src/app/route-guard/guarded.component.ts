import { Component } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-guarded',
  standalone: true,
  imports: [
    RouterLinkWithHref
  ],
  template: `
  <h1>Welcome to the guarded route!</h1>
  <p>This page is only accessible if you are logged in.</p>
  <a [routerLink]="['/', 'route-guard']">Back</a>
  `
})
export class GuardedComponent {
}
