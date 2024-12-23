import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private http: HttpClient) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token'); // Retrieve JWT token from localStorage

    // Exclude logging for requests to /api/logs
    if (req.url.includes('/api/logs')) {
      return next.handle(req);
    }

    // Clone the request and add the Authorization header if the token exists
    const clonedRequest = token
      ? req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        })
      : req;

    return next.handle(clonedRequest).pipe(
      tap(
        (event: HttpEvent<any>) => {
          // Log successful HTTP responses (if needed)
          if (event.type === 4) { // HttpResponse type
            this.logToBackend(`HTTP ${event['status']}: ${req.url}`, event['status']);
          }
        },
        (error: HttpErrorResponse) => {
          // Log HTTP errors
          this.logToBackend(
            `HTTP ${error.status}: ${error.message} - ${req.url}`,
            error.status || 500
          );
        }
      )
    );
  }

  private logToBackend(message: string, statusCode: number): void {
    // Send logs to the Node.js backend (5000)
    this.http.post('http://localhost:5000/api/logs', { message, statusCode }).subscribe({
      error: (err) => console.error('Failed to send log to backend:', err),
    });
  }
}
