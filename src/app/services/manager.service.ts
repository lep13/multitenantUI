// manager.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Group {
  _id: string;
  group_name: string;
  members: string[];
  manager: string;
  budget?: number; 
}

interface CreateUserResponse {
  status: string;
  message: string;
}

interface DeleteUserResponse {
  status: string;
  message: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiUrl = 'http://localhost:5000/api/groups'; // Use Node.js server for displaying group data
  private goApiUrl = 'http://localhost:8080'; // Go server for CRUD operations

  constructor(private http: HttpClient) {}

    // Fetch groups for display on the manager dashboard
    getGroups(): Observable<Group[]> {
      return this.http.get<Group[]>(this.apiUrl);
    }

    // Create user - Add user (uses Go server)
    createUser(username: string, password: string): Observable<CreateUserResponse> {
      const data = { username, password };
      return this.http.post<CreateUserResponse>(`${this.goApiUrl}/create-user`, data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
    }

    // Delete user (uses Go server)
    deleteUser(username: string): Observable<DeleteUserResponse> {
      return this.http.request<DeleteUserResponse>('delete', `${this.goApiUrl}/delete-user`, {
        body: { username },
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
    }

    createGroup(managerUsername: string, groupName: string): Observable<any> {
      return this.http.post<any>(`${this.goApiUrl}/create-group`, { username: managerUsername, group_name: groupName });
    }
  
    addUserToGroup(managerUsername: string, groupName: string, user: string): Observable<any> {
      console.log('Adding user to group:', { managerUsername, groupName, user });
      return this.http.post<any>(`${this.goApiUrl}/add-user`, { username: managerUsername, group_name: groupName, user });
    }    
  
    addBudget(managerUsername: string, groupName: string, budget: number): Observable<any> {
      return this.http.post<any>(`${this.goApiUrl}/add-budget`, { manager: managerUsername, group_name: groupName, budget });
    }

    // Fetch groups for a specific manager
    listGroups(managerUsername: string): Observable<ApiResponse> {
      return this.http.get<ApiResponse>(`${this.goApiUrl}/list-groups?username=${encodeURIComponent(managerUsername)}`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      });
    }        

    // Remove user from group
    removeUserFromGroup(manager: string, groupName: string, user: string): Observable<any> {
      return this.http.post<any>(`${this.goApiUrl}/remove-user`, {
        username: manager,
        group_name: groupName,
        user: user,
      });
    }

    // Update budget for a group
    updateGroupBudget(manager: string, groupName: string, budget: number): Observable<any> {
      return this.http.post<any>(`${this.goApiUrl}/update-budget`, {
        manager: manager,
        group_name: groupName,
        budget: budget,
      });
  }
}
