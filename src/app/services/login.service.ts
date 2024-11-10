import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
  success: boolean;
  message: string;
  redirectURL?: string; // backend returns a redirectURL for redirection
  token?: string; // if using tokens, token can be stored here
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8080'; // Go server's URL

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password });
  }
}
