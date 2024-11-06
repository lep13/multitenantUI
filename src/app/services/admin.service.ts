import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CreateManagerResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080'; // Update with your Go server's URL

  constructor(private http: HttpClient) {}

  createManager(username: string, password: string, groups: number): Observable<CreateManagerResponse> {
    return this.http.post<CreateManagerResponse>(`${this.apiUrl}/create_manager`, {
      username,
      password,
      groups
    });
  }
  deleteManager(username: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/delete_manager/${username}`);
  }
}
