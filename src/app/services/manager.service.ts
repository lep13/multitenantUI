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
 
// interface ApiResponse {
//   status: string;
//   message: string;
//   data?: any;
// }
 
@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiUrl = 'http://localhost:5000/api'; // Use Node.js server for displaying group data
  private goApiUrl = 'http://localhost:8080'; // Go server for CRUD operations
 
  constructor(private http: HttpClient) {}
 
    // Fetch manager usernames for the dropdown
    getManagerUsernames(): Observable<{ username: string }[]> {
      return this.http.get<{ username: string }[]>(`${this.apiUrl}/managers`);
    }
 
    // Fetch groups for display on the manager dashboard
    getGroups(): Observable<Group[]> {
      return this.http.get<Group[]>(`${this.apiUrl}/groups`);
    }
 
    // Fetch usernames for users with the tag "user" (for delete user dropdown)
    getUsernames(): Observable<string[]> {
      return this.http.get<string[]>(`${this.apiUrl}/users`);
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
 
      // Method to check if a user is already in another group
      isUserInAnotherGroup(username: string): Observable<any> {
        const url = `${this.goApiUrl}/check-user-group?username=${encodeURIComponent(username)}`;
        return this.http.get<any>(url); // Ensure typing here
      }      
 
    // Fetch groups for a specific manager
    getGroupsByManager(managerUsername: string): Observable<any> {
      const url = `${this.goApiUrl}/list-groups?username=${encodeURIComponent(managerUsername)}`;
      return this.http.get(url);
    }
 
    updateGroupBudget(manager: string, groupName: string, budget: number): Observable<any> {
      const url = `${this.goApiUrl}/update-budget`;
      return this.http.put(url, { manager, group_name: groupName, budget });
    }
 
    removeUserFromGroup(manager: string, groupName: string, user: string): Observable<any> {
      const url = `${this.goApiUrl}/remove-user`;
      return this.http.delete(url, { body: { username: manager, group_name: groupName, user } });
    }
}