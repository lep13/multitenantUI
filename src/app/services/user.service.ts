import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Manager {
  username: string;
  group_limit: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/managers'; // Update URL to /api/managers

  constructor(private http: HttpClient) {}

  getGroupBudget(groupId: string) {
    return this.http.get<{ group_name: string; budget: number }>(
      `http://localhost:5000/api/group-name?group_id=${groupId}`
    );
  }  

  getManagers(): Observable<Manager[]> {
    return this.http.get<Manager[]>(this.apiUrl);
  }
}
