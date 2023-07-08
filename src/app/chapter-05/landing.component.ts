import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error/error.component';
import { LoadingWrapperComponent } from './loading/loading-wrapper.component';

@Component({
  standalone: true,
  imports: [CommonModule, ErrorComponent, LoadingWrapperComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['landing.component.css'],
})
export class LandingComponent {
  isLoading = false;
  errorText = '';

  getData() {
    this.errorText = '';
    this.isLoading = true;
    setTimeout(() => {
      this.errorText =
        'An error has occurred. Press the Get Data button to try again.';
      this.isLoading = false;
    }, 2500);
  }
}
