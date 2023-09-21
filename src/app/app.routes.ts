import { Routes } from '@angular/router';
import { authGuard } from './route-guard/auth.guard';

export const routes: Routes = [
  {
    path: 'angular-component',
    loadComponent: () =>
      import('./angular-component/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'route-guard',
    loadComponent: () =>
      import('./route-guard/route-guard-landing.component').then((m) => m.RouteGuardLandingComponent),
  },
  {
    path: 'guarded-route',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./route-guard/guarded.component').then((m) => m.GuardedComponent)
  },
  {
    path: 'resolve-or-die',
    loadComponent: () =>
      import('./resolve-or-die/landing.component').then((m) => m.LandingComponent),
  },
];
