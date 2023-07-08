import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'chapter-04',
    loadComponent: () =>
      import('./chapter-04/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'chapter-05',
    loadComponent: () =>
      import('./chapter-05/loading-example.component').then(
        (m) => m.LoadingExampleComponent
      ),
  },
  // {
  //   path: 'error',
  //   loadComponent: () =>
  //     import('./error/error.component').then((m) => m.ErrorComponent),
  // },
];
