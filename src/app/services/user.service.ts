import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api'; // Backend API base URL

  constructor(private http: HttpClient) {}

  // Fetch group budget by group ID
  getGroupBudget(groupId: string): Observable<{ group_name: string; budget: number }> {
    return this.http.get<{ group_name: string; budget: number }>(`${this.apiUrl}/group-name?group_id=${groupId}`);
  }

  // Fetch all managers
  getManagers(): Observable<{ username: string; group_limit: number }[]> {
    return this.http.get<{ username: string; group_limit: number }[]>(`${this.apiUrl}/managers`);
  }

  // Send notification to the manager
  sendNotification(
    username: string,
    manager: string,
    requestedService: string,
    estimatedCost: number,
    budget: number
  ): Observable<any> {
    const payload = {
      username,
      manager,
      requested_service: requestedService,
      estimated_cost: estimatedCost,
      budget,
    };
    return this.http.post(`${this.apiUrl}/send-notification`, payload);
  }
}
