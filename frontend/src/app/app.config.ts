import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { environment } from '../environments/environment.exam';
import { provideNativeDateAdapter } from '@angular/material/core';

import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return sessionStorage.getItem('token'); 
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes),
  provideClientHydration(),
  provideHttpClient(withInterceptorsFromDi()),
  provideAnimationsAsync(),
  provideNativeDateAdapter(),

  importProvidersFrom(
    JwtModule.forRoot({
      config: {
        tokenGetter,

        allowedDomains: [environment.dom],

        disallowedRoutes: [
          `${environment.base}/login`,
          `${environment.base}/actuator/health`,
        ],
      },
    })
  ), provideAnimationsAsync(),
  ],
};
