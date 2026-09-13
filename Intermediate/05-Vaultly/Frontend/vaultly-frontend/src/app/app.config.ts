import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideStore } from '@ngrx/store';
import { quotesReducer } from './state/quotes/quotes.reducer';
import { provideEffects } from '@ngrx/effects';
import { QuotesEffects } from './state/quotes/quotes.effec';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({ quotes: quotesReducer }),
    provideEffects([QuotesEffects]),
    provideStoreDevtools({ maxAge: 25 })
  ]
};
