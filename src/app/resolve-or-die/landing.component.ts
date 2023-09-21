import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error/error.component';
import { LoadingWrapperComponent } from './loading/loading-wrapper.component';
import { SkeletonComponent } from './skeleton/skeleton';
import { DataService } from './data.service';
import { EMPTY, Observable, catchError, finalize, firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ErrorComponent,
    LoadingWrapperComponent,
    SkeletonComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['landing.component.css'],
})
export class LandingComponent {
  isLoading = false;
  errorText = '';
  data = {}; // Unused for demo

  constructor(private dataService: DataService) {}

  async getData() {
    this.errorText = '';
    this.isLoading = true;
    const data$ = this.dataService.getData().pipe(
      catchError((e) => {
        this.errorText = e.message;
        return EMPTY;
      }),
      finalize(() => (this.isLoading = false))
    );

    // Normally, I would handle this inside the Observable but I'm really
    // showing the error handling. this.data will never have any other value.
    this.data = await firstValueFrom(data$);
  }
}
