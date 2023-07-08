import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../chapter-04/loading/loading.component';
import { DataService } from './data.service';
import { firstValueFrom } from 'rxjs';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-loading-example',
  standalone: true,
  imports: [CommonModule, LoadingComponent, RouterLinkWithHref],
  template: `
    <p>Data from service: {{ data }}</p>
    <p *ngIf="errorText">
      Error: {{ errorText }}. You can <a (click)="getData()">retry</a>, or
      <a href="/home">return home</a>.
    </p>
    <app-loading label="Loading data now..." [shown]="isLoading"> </app-loading>
  `,
  styles: [
    `
      :host {
        display: block;

        a {
          text-decoration: underline;
          cursor: pointer;
        }
      }
    `,
  ],
})
export class LoadingExampleComponent implements OnInit {
  errorText = '';
  isLoading = false;
  data = '';

  // Alternative service injection
  // dataService = inject(DataService);

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getData();
  }

  async getData() {
    this.errorText = '';
    this.isLoading = true;

    try {
      this.data = await firstValueFrom(this.dataService.getData());
    } catch (error: any) {
      this.errorText = error.message;
    } finally {
      this.isLoading = false;
    }
  }
}
