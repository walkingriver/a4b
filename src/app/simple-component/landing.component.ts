import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';

@Component({
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  template: `
    <h1>Chapter 4</h1>
    <h2>A Simple Angular Component</h2>
    <p>
      This is a demo of a simple Angular component from Chapter 4. It contains
      no imperative code. Click the button to simulate a request. The loading
      component will be shown for about 2.5 seconds, and then will reset.
    </p>
    <button (click)="getData()">Get Data</button>
    <app-loading label="Loading data now..." [shown]="isLoading"> </app-loading>
  `,
  styles: [],
})
export class LandingComponent {
  isLoading = false;
  getData() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2500);
  }
}
