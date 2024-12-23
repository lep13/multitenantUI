import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  constructor(private http: HttpClient) {}

  log(message: string, statusCode: number): void {
    const logData = {
      message,
      statusCode,
    };

    this.http.post('/api/logs', logData).subscribe(
      () => console.log('Log sent successfully'),
      (error) => console.error('Failed to send log:', error)
    );
  }
}
