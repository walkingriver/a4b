import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AsyncPipe, NgIf,],
  template: `
  <ng-container *ngIf="isLoggedIn$ | async as isLoggedIn ; else notLoggedIn">
    <h2>You are logged in</h2>
    <button (click)="logout()">Logout</button>
  </ng-container>
  <ng-template #notLoggedIn>
    <h2>You are logged out</h2>
    <h3>Username: demo / Password: password</h3>
    <form>
    <label>Username:</label>
    <input type="text" #username><br>
    <label>Password:</label>
    <input type="password" #password><br>
    <button (click)="login(username.value, password.value)">Login</button>
    </form>
  </ng-template>
  `
})
export class LoginComponent {
  isLoggedIn$ = this.authService.isAuthenticated$;

  constructor(private authService: AuthService, private router: Router) { }

  login(username: string, password: string) {
    if (username === 'demo' && password === 'password') {
      this.authService.setAuthenticated(true);
      this.router.navigate(['/guarded-route']);
    } else {
      alert('Invalid credentials!');
    }
  }

  logout() {
    this.authService.setAuthenticated(false);
  }
}
