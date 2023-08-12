import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="wrapper" *ngIf="isLoading">
      <div class="lds-circle"><div></div></div>
    </div>
    <div *ngIf="errorText">
      <h1>Error</h1>
      <p>{{ errorText }}</p>
    </div>
  `,
  styles: [
    `
      .wrapper {
        display: flex;
        justify-content: center;
      }
      .lds-circle {
        display: inline-block;
        transform: translateZ(1px);
      }
      .lds-circle > div {
        display: inline-block;
        width: 64px;
        height: 64px;
        margin: 8px;
        border-radius: 50%;
        background: #8cb370;
        animation: lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
      }
      @keyframes lds-circle {
        0%,
        100% {
          animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
        }
        0% {
          transform: rotateY(0deg);
        }
        50% {
          transform: rotateY(1800deg);
          animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
        }
        100% {
          transform: rotateY(3600deg);
        }
      }
    `,
  ],
})
export class LoadingWrapperComponent {
  @Input() errorText = '';
  @Input() isLoading = false;
}
