import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';
import { AuthInterceptorService } from './app/services/auth-interceptor.service';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, HttpClientModule, AppRoutingModule), // Import routing and other modules
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true, // Ensure multiple interceptors can be registered
    },
  ],
}).then((appRef) => {
  // Use the app's injector to get the HttpClient
  const injector = appRef.injector;
  const http = injector.get(HttpClient);

  // Preserve original console methods
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  // Monkey-patch console.log
  console.log = function (...args: any[]) {
    if (args.some((arg) => typeof arg === 'string' && arg.includes('/api/logs'))) {
      // Skip logging for /api/logs to prevent infinite loop
      return originalLog.apply(console, args);
    }
    originalLog.apply(console, args); // Log to the browser console as usual
    sendLogToBackend(http, args.join(' '), 200); // Default status code 200
  };

  // Monkey-patch console.error
  console.error = function (...args: any[]) {
    if (args.some((arg) => typeof arg === 'string' && arg.includes('/api/logs'))) {
      // Skip logging for /api/logs to prevent infinite loop
      return originalError.apply(console, args);
    }
    originalError.apply(console, args); // Log to the browser console as usual
    sendLogToBackend(http, args.join(' '), 500); // Default status code 500
  };

  // Monkey-patch console.warn
  console.warn = function (...args: any[]) {
    if (args.some((arg) => typeof arg === 'string' && arg.includes('/api/logs'))) {
      // Skip logging for /api/logs to prevent infinite loop
      return originalWarn.apply(console, args);
    }
    originalWarn.apply(console, args); // Log to the browser console as usual
    sendLogToBackend(http, args.join(' '), 400); // Default status code 400
  };

  // Helper function to send logs to the backend
  function sendLogToBackend(http: HttpClient, message: string, statusCode: number): void {
    // Avoid logging /api/logs requests to prevent recursive calls
    if (message.includes('/api/logs')) {
      return;
    }

    http.post('http://localhost:5000/api/logs', { message, statusCode }).subscribe({
      error: (err) => originalError('Error sending log to backend:', err),
    });
  }
});
