import { Component } from '@angular/core';
import { ManagerService } from '../services/manager.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manager-creategroup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manager-creategroup.component.html',
  styleUrl: './manager-creategroup.component.scss'
})

export class ManagerCreateGroupComponent {
  groupName: string = '';
  managerUsername: string = '';
  newUser: string = '';
  users: string[] = [];
  budget: number | null = null;
  responseMessage: string | null = null;

  constructor(private managerService: ManagerService) {}

  addUser() {
    if (this.newUser && !this.users.includes(this.newUser)) {
      this.users.push(this.newUser);
      this.newUser = '';
    }
  }

  removeUser(user: string) {
    this.users = this.users.filter(u => u !== user);
  }

  async createGroup() {
    try {
      // Step 1: Create the group with group name and manager
      const createGroupResponse = await this.managerService.createGroup(this.managerUsername, this.groupName).toPromise();

      if (createGroupResponse.status === 'error') {
        this.responseMessage = `Failed to create group: ${createGroupResponse.message}`;
        return;
      }

      // Step 2: Add users to the group sequentially and handle errors individually
      for (const user of this.users) {
        const addUserResponse = await this.managerService.addUserToGroup(this.managerUsername, this.groupName, user).toPromise();
        if (addUserResponse.status === 'error') {
          this.responseMessage = `Failed to add user ${user}: ${addUserResponse.message}`;
          return;
        }
      }

      // Step 3: Add budget to the group
      if (this.budget !== null) {
        const addBudgetResponse = await this.managerService.addBudget(this.managerUsername, this.groupName, this.budget).toPromise();
        if (addBudgetResponse.status === 'error') {
          this.responseMessage = `Failed to add budget: ${addBudgetResponse.message}`;
          return;
        }
      }

      // If all steps succeed
      this.responseMessage = 'Group created successfully with users and budget added!';
    } catch (error: any) {
      this.responseMessage = `Error: ${error?.message || 'An error occurred'}`;
      console.error('Error:', error);
    }
  }
}