import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="errorText">
      <h1>Error</h1>
      <p>{{ errorText }}</p>
    </div>
  `,
  styles: [],
})
export class ErrorComponent {
  @Input() errorText = '';
}
