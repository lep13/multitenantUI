import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
 
interface CreateManagerResponse {
  success: boolean;
  message: string;
}
 
interface CreateManagerRequest {
  username: string;
  email: string;
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
  private apiUrl = 'http://localhost:5000/api';
 
  constructor(private http: HttpClient) {}
 
  // Fetch manager usernames for the dropdown
  getManagerUsernames(): Observable<{ username: string }[]> {
    return this.http.get<{ username: string }[]>(`${this.apiUrl}/managers`);
  }
 
  createManager(data: CreateManagerRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.goApiUrl}/admin/create-manager`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }
 
  deleteManager(data: RemoveManagerRequest): Observable<ApiResponse> {
    return this.http.request<ApiResponse>('delete', `${this.goApiUrl}/admin/delete-manager`, {
      body: data,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}