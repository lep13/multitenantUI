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
  currentUsers: string[] = []; // Array to hold users until group is created
  availableUsernames: string[] = []; // List of available usernames for the dropdown
  budget: number | null = null;
  groupID: string = ''; // Property to store the created group ID after createGroup is called
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
    this.users = this.users.filter((u) => u !== user);
    this.userNotExistErrorMessage = null; // Clear the error when a user is removed
  }
 
  async createGroup() {
    // Validate group name
    if (!this.groupName.trim()) {
      this.groupNameErrorMessage = 'Group name is required.';
      return;
    } else {
      this.groupNameErrorMessage = null;
    }
 
    // Validate user list
    if (this.users.length === 0) {
      this.userNotExistErrorMessage = 'You must add at least one user to create a group.';
      return;
    }
 
    // Validate budget
    if (this.budget === null || this.budget <= 0) {
      this.userNotExistErrorMessage = 'Budget must be greater than zero.';
      return;
    }
 
    if (this.budget > 5000) {
      this.userNotExistErrorMessage = 'Budget cannot exceed 5000.';
      return;
    }
 
    try {
      // Save users to currentUsers
      this.currentUsers = [...this.users];
 
      const createGroupResponse = await this.managerService
        .createGroup(this.managerUsername, this.groupName)
        .toPromise();
 
      if (createGroupResponse.status === 'error') {
        this.responseMessage = `Failed to create group: ${createGroupResponse.message}`;
        this.isModalOpen = true;
        return;
      }
 
      // Store the created group ID AFTER the group is successfully created
      this.groupID = createGroupResponse.data?.group_id;
 
      if (!this.groupID) {
        this.responseMessage = 'Group created, but failed to retrieve group ID.';
        this.isModalOpen = true;
        return;
      }
 
      // Add budget to the group
      await this.addBudgetToGroup();
 
      // Call the function to add users after the group is created
      this.addUsersToGroup();
 
      this.responseMessage = 'Group created successfully!';
      this.isModalOpen = true;
    } catch (error: any) {
      this.responseMessage = `Error: ${error?.message || 'An error occurred'}`;
      this.isModalOpen = true;
      console.error('Error:', error);
    }
  }
 
  async addBudgetToGroup() {
    if (!this.groupID) {
      this.responseMessage = 'Cannot add budget. Group ID is missing.';
      this.isModalOpen = true;
      return;
    }
 
    try {
      const addBudgetResponse = await this.managerService
        .addBudget(this.managerUsername, this.groupID, this.budget!)
        .toPromise();
 
      if (addBudgetResponse.status === 'error') {
        this.responseMessage = `Failed to add budget: ${addBudgetResponse.message}`;
        this.isModalOpen = true;
        return;
      }
 
      console.log('Budget added successfully');
    } catch (error: any) {
      console.error('Error while adding budget:', error);
      this.responseMessage = `Error: ${error?.message || 'An error occurred while adding budget'}`;
      this.isModalOpen = true;
    }
  }
 
  async addUsersToGroup() {
    if (!this.groupID) {
      this.responseMessage = 'Cannot add users. Group ID is missing.';
      this.isModalOpen = true;
      return;
    }
 
    try {
      for (const user of this.currentUsers) {
        const addUserResponse = await this.managerService
          .addUserToGroup(this.managerUsername, this.groupID, user)
          .toPromise();
        if (addUserResponse.status === 'error') {
          console.error(`Failed to add user ${user}: ${addUserResponse.message}`);
        }
      }
      // this.responseMessage = 'Users added to the group successfully!';                   //old response
      this.responseMessage = 'Group created and Users added to the group successfully!';
      this.currentUsers = []; // Clear the users array after processing
      this.isModalOpen = true;
    } catch (error: any) {
      console.error('Error while adding users:', error);
      this.responseMessage = `Error: ${error?.message || 'An error occurred while adding users'}`;
      this.isModalOpen = true;
    }
  }
 
  closeModal() {
    this.isModalOpen = false;
  }
}