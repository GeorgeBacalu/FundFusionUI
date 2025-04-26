import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import Lara from '@primeng/themes/lara';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Lara, options: { colorScheme: 'light-green', cssLayer: { name: 'primeng', order: 'app-styles, primeng' }, darkModeSelector: 'body.dark-mode' } } })
  ]
};