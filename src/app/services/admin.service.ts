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
  private goApiUrl = 'http://localhost:8080'; // Go server for CRUD operations

  constructor(private http: HttpClient) {}

  createManager(data: CreateManagerRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.goApiUrl}/create-manager`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deleteManager(data: RemoveManagerRequest): Observable<ApiResponse> {
    return this.http.request<ApiResponse>('delete', `${this.goApiUrl}/delete-manager`, {
      body: data,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
