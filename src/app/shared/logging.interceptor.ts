import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(private loggingService: LoggingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const startTime = Date.now();
    return next.handle(req).pipe(
      tap(
        (event) => {
          if (event instanceof HttpResponse) {
            const elapsedTime = Date.now() - startTime;
            const logMessage = `HTTP Request to ${req.url} took ${elapsedTime}ms with status ${event.status}`;
            this.loggingService.log(logMessage, event.status);
          }
        },
        (error) => {
          const logMessage = `HTTP Request to ${req.url} failed with status ${error.status}`;
          this.loggingService.log(logMessage, error.status || 0);
        }
      )
    );
  }
}
