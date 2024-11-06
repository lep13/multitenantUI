import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CreateManagerResponse {
  success: boolean;
  message: string;
}

interface CreateManagerRequest {
  username: string;
  password: string;
  group_limit: number;
}

interface RemoveManagerRequest {
  username: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080'; // Update with your Go server's URL

  constructor(private http: HttpClient) {}

  createManager(data: CreateManagerRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/create-manager`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deleteManager(data: RemoveManagerRequest): Observable<ApiResponse> {
    return this.http.request<ApiResponse>('delete', `${this.apiUrl}/delete-manager`, {
      body: data,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
