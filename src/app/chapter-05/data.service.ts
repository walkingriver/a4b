import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public getData() {
    return timer(3500).pipe(
      map((_) => {
        throw new Error('This is a fake error');
      })
    );
  }
}
