import { Component } from '@angular/core';
import { ManagerService } from '../services/manager.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-manager-creategroup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manager-creategroup.component.html',
  styleUrls: ['./manager-creategroup.component.scss']
})
export class ManagerCreateGroupComponent {
  groupName: string = '';
  managerUsername: string = '';
  managers: { username: string }[] = []; // List of manager usernames for the dropdown
  newUser: string = '';
  users: string[] = [];
  availableUsernames: string[] = []; // List of available usernames for the dropdown
  budget: number | null = null;
  addUserErrorMessage: string | null = null;
  responseMessage: string | null = null;
  isModalOpen: boolean = false;
  errorMessage: string | null = null;
  userNotExistErrorMessage: string | null = null;
  groupNameErrorMessage: string | null = null;
 
  constructor(private managerService: ManagerService, private router: Router) {}
 
  ngOnInit(): void {
    this.loadManagerUsernames();
    this.loadUsernames();
  }
 
  loadManagerUsernames() {
    this.managerService.getManagerUsernames().subscribe(
      (data) => {
        this.managers = data;
      },
      (error) => {
        console.error('Failed to load manager usernames', error);
      }
    );
  }
 
  loadUsernames() {
    this.managerService.getUsernames().subscribe(
      (data) => {
        this.availableUsernames = data;
      },
      (error) => {
        console.error('Failed to load usernames', error);
      }
    );
  }
 
  navigateToDashboard() {
    this.router.navigate(['/manager']);
  }
 
  navigateToCreateUser() {
    this.router.navigate(['/create-user']);
  }
 
  navigateToDeleteUser() {
    this.router.navigate(['/delete-user']);
  }
 
  navigateToUpdateGroup() {
    this.router.navigate(['/update-group']);
  }
 
  addUser() {
    // Check if the users list already has 2 users
    if (this.users.length >= 2) {
      this.userNotExistErrorMessage = 'A group cannot have more than 2 users.';
      return;
    }
 
    if (this.newUser && !this.users.includes(this.newUser)) {
      // Check if the user is already in another group
      this.managerService.isUserInAnotherGroup(this.newUser).subscribe(
        (response) => {
          if (response.status === 'success') {
            // User is not in another group, so add to the group
            this.users.push(this.newUser);
            this.newUser = '';
            this.errorMessage = null; // Clear any previous error messages
            this.userNotExistErrorMessage = null; // Clear user existence error message
          } else {
            // User is already in another group or doesn't exist
            this.userNotExistErrorMessage = response.message;
          }
        },
        (error) => {
          // Handle any unexpected errors
          if (error.error && error.error.message) {
            this.userNotExistErrorMessage = error.error.message;
          } else {
            this.userNotExistErrorMessage = 'Unable to check user group status. Please try again.';
          }
        }
      );
    } else {
      // If the user is already in the users list or does not exist
      this.userNotExistErrorMessage = 'User is already a member of another group or does not exist.';
    }
  }
 
  removeUser(user: string) {
    this.users = this.users.filter(u => u !== user);
    this.userNotExistErrorMessage = null; // Clear the error when a user is removed
  }
 
  async createGroup() {
    // Validate group name
    if (!this.groupName.trim()) {
      this.groupNameErrorMessage = 'Group name is required.';
      return;
    } else {
      this.groupNameErrorMessage = null; // Clear the error if group name is provided
    }
 
    // Validate user list
    if (this.users.length === 0) {
      this.userNotExistErrorMessage = 'You must add at least one user to create a group.';
      return;
    }
 
    try {
      const createGroupResponse = await this.managerService.createGroup(this.managerUsername, this.groupName).toPromise();
      if (createGroupResponse.status === 'error') {
        this.responseMessage = `Failed to create group: ${createGroupResponse.message}`;
        this.isModalOpen = true;
        return;
      }
 
      for (const user of this.users) {
        const addUserResponse = await this.managerService.addUserToGroup(this.managerUsername, this.groupName, user).toPromise();
        if (addUserResponse.status === 'error') {
          this.responseMessage = `Failed to add user ${user}: ${addUserResponse.message}`;
          this.isModalOpen = true;
          return;
        }
      }
 
      if (this.budget !== null && this.budget <= 5000) {
        const addBudgetResponse = await this.managerService.addBudget(this.managerUsername, this.groupName, this.budget).toPromise();
        if (addBudgetResponse.status === 'error') {
          this.responseMessage = `Failed to add budget: ${addBudgetResponse.message}`;
          this.isModalOpen = true;
          return;
        }
      } else if (this.budget && this.budget > 5000) {
        this.userNotExistErrorMessage = 'Budget cannot exceed 5000.';
        return;
      }
 
      this.responseMessage = 'Group created successfully with users and budget added!';
      this.isModalOpen = true;
    } catch (error: any) {
      this.responseMessage = `Error: ${error?.message || 'An error occurred'}`;
      this.isModalOpen = true;
      console.error('Error:', error);
    }
  }
 
  closeModal() {
    this.isModalOpen = false;
  }
}