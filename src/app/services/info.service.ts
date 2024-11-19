import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class InfoService {
  private readonly apiUrl = 'http://localhost:5000/api';

  private usernameSubject = new BehaviorSubject<string | null>(null);
  public username$ = this.usernameSubject.asObservable();

  constructor(private jwtService: JwtService, private http: HttpClient) {
    this.loadUsername();
  }

  private loadUsername() {
    const username = this.jwtService.getUsernameFromToken();
    this.usernameSubject.next(username);
  }

  getUsername(): string | null {
    return this.usernameSubject.value;
  }

  // Function to fetch user data by username
  getUserInfo(username: string): Observable<{ tag: string; email: string }> {
    return this.http.get<{ tag: string; email: string }>(`${this.apiUrl}/user?username=${username}`);
  }

}
