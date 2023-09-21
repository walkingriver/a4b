import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  setAuthenticated(value: boolean) {
    this.isAuthenticated.next(value);
  }

  get isAuthenticated$() {
    return this.isAuthenticated.asObservable();
  }
}
