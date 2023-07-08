import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

const legacyProviders = importProvidersFrom([
  NgxSkeletonLoaderModule.forRoot(),
]);

export const appConfig: ApplicationConfig = {
  providers: [legacyProviders, provideRouter(routes)],
};
