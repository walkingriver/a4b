import { ResolveFn, Router } from '@angular/router';
import { DataService } from './data.service';
import { catchError, map } from 'rxjs';
import { inject } from '@angular/core';

export const dataResolverResolver: ResolveFn<boolean> = (route, state) => {
  const dataService = inject(DataService);
  const router = inject(Router);

  dataService.getData().pipe(
    map((data) => {
      // Here we would do something with the data
    }),
    catchError((error) => {
      router.navigateByUrl('/error');
      throw error;
    })
  );
  return true;
};
