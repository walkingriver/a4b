import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'simple-component',
    loadComponent: () =>
      import('./simple-component/landing.component').then(
        (m) => m.LandingComponent
      ),
  },
  {
    path: 'resolve-or-die',
    loadComponent: () =>
      import('./resolve-or-die/landing.component').then(
        (m) => m.LandingComponent
      ),
  },
  {
    path: 'ng-model-checkbox',
    loadComponent: () =>
      import('./ng-model-checkbox/landing.component').then(
        (m) => m.LandingComponent
      ),
  },
];
