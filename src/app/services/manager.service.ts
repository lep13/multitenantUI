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

interface Manager {
  username: string;
  group_limit: number;
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
  private apiUrl = 'http://localhost:5000/api'; // Node.js server for displaying group data
  private goApiUrl = 'http://localhost:8080'; // Go server for CRUD operations
 
  constructor(private http: HttpClient) {}

    // Fetch managers for group limit
    getManagers(): Observable<Manager[]> {
      return this.http.get<Manager[]>(`${this.apiUrl}/managers`);
    }
 
    // Fetch manager usernames for the dropdown
    getManagerUsernames(): Observable<{ username: string }[]> {
      return this.http.get<{ username: string }[]>(`${this.apiUrl}/managers`);
    }
 
    // Fetch groups for display on the manager dashboard
    getGroups(): Observable<Group[]> {
      return this.http.get<Group[]>(`${this.apiUrl}/groups`);
    }
 
    // Fetch usernames for the dropdown
    getUsernames(): Observable<string[]> {
      return this.http.get<string[]>(`${this.apiUrl}/users`); // Ensure the correct endpoint is used
    }

    getServicesByGroup(groupId: string): Observable<any[]> {
      const url = `${this.apiUrl}/services?group_id=${groupId}`;
      return this.http.get<any[]>(url); // Ensure the returned data matches the backend response
    }    
 
    // Create user - Add user (uses Go server)
    createUser(username: string, email: string, password: string): Observable<CreateUserResponse> {
      const data = { username, email, password };
      return this.http.post<CreateUserResponse>(`${this.goApiUrl}/manager/create-user`, data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
    }
 
    // Delete user (uses Go server)
    deleteUser(username: string): Observable<DeleteUserResponse> {
      return this.http.request<DeleteUserResponse>('delete', `${this.goApiUrl}/manager/delete-user`, {
        body: { username },
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      });
    }
 
    createGroup(managerUsername: string, groupName: string): Observable<any> {
      return this.http.post<any>(`${this.goApiUrl}/manager/create-group`, { username: managerUsername, group_name: groupName });
    }
 
    addUserToGroup(managerUsername: string, groupID: string, user: string): Observable<any> {
      console.log('Adding user to group:', { managerUsername, groupID, user });
      return this.http.post<any>(`${this.goApiUrl}/manager/add-user`, {
        manager: managerUsername,
        group_id: groupID,
        username: user,
      });
    }
 
    addBudget(managerUsername: string, groupID: string, budget: number): Observable<any> {
      return this.http.post<any>(`${this.goApiUrl}/manager/add-budget`, {
        manager: managerUsername,
        group_id: groupID,
        budget: budget,
      });
    }
 
      // Method to check if a user is already in another group
      isUserInAnotherGroup(username: string): Observable<any> {
        const url = `${this.goApiUrl}/manager/check-user-group?username=${encodeURIComponent(username)}`;
        return this.http.get<any>(url); // Ensure typing here
      }      
 
    // Fetch groups for a specific manager
    getGroupsByManager(managerUsername: string): Observable<any> {
      const url = `${this.goApiUrl}/manager/list-groups?username=${encodeURIComponent(managerUsername)}`;
      return this.http.get(url);
    }
 
    updateGroupBudget(manager: string, groupName: string, budget: number): Observable<any> {
      const url = `${this.goApiUrl}/manager/update-budget`;
      return this.http.put(url, { manager, group_name: groupName, budget });
    }
 
    removeUserFromGroup(manager: string, groupID: string, user: string): Observable<any> {
      const url = `${this.goApiUrl}/manager/remove-user`;
      return this.http.delete(url, {
        body: { manager, group_id: groupID, username: user },
      });
    }

    // Fetch the last 5 notifications for a manager
    getNotifications(manager: string): Observable<any> {
      return this.http.get(`${this.apiUrl}/notifications?manager=${manager}`);
    }
}