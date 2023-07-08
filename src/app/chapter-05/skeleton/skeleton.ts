import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule, NgxSkeletonLoaderModule],
  template: `
    <div *ngIf="errorText && !isLoading">
      <h1>Error</h1>
      <p>
        {{ errorText }}
      </p>
    </div>
    <div *ngIf="isLoading">
      <h1>
        <ngx-skeleton-loader></ngx-skeleton-loader>
      </h1>
      <p>
        <ngx-skeleton-loader [count]="3"></ngx-skeleton-loader>
      </p>
    </div>
  `,
  styles: [],
})
export class SkeletonComponent {
  @Input() errorText = '';
  @Input() isLoading = false;
}
