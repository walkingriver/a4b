import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { DataService } from './data.service';
import { catchError, map } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorResolverService implements Resolve<any> {
  constructor(private data: DataService, private router: Router) {}

  resolve() {
    return this.data.getData().pipe(
      map(() => {
        // Here we would do something with the data
      }),
      catchError((e) => {
        this.router.navigateByUrl('/error');
        return EMPTY;
      })
    );
  }
}
