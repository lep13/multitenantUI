import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../services/manager.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


interface Group {
  _id: string;
  group_name: string;
  members: string[];
  manager: string;
  budget?: number; 
}

@Component({
  selector: 'app-manager-updategroup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manager-updategroup.component.html',
  styleUrl: './manager-updategroup.component.scss'
})

export class ManagerUpdateGroupComponent {
  managerUsername: string = '';
  groups: any[] = [];
  selectedGroup: any = null;
  newBudget: number | null = null;
  responseMessage: string | null = null;

  constructor(private managerService: ManagerService) {}

  fetchGroups() {
    if (!this.managerUsername) {
      this.responseMessage = "Please enter a manager username.";
      return;
    }
  
    this.managerService.listGroups(this.managerUsername).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.groups = response.data;
          this.responseMessage = null;
        } else {
          this.responseMessage = response.message;
        }
      },
      (error) => {
        console.error('Error fetching groups:', error);
        this.responseMessage = 'An error occurred while fetching groups.';
      }
    );
  }

  onSelectGroup(group: any) {
    this.selectedGroup = group;
    this.newBudget = group.budget || null;
  }

  updateBudget() {
    if (this.selectedGroup && this.newBudget !== null) {
      this.managerService.updateGroupBudget(this.managerUsername, this.selectedGroup.group_name, this.newBudget).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.responseMessage = 'Budget updated successfully!';
            this.selectedGroup.budget = this.newBudget;
          } else {
            this.responseMessage = `Failed to update budget: ${response.message}`;
          }
        },
        (error) => {
          this.responseMessage = 'An error occurred while updating the budget.';
          console.error('Error updating budget:', error);
        }
      );
    } else {
      this.responseMessage = 'Please select a group and enter a budget.';
    }
  }

  removeUser(user: string) {
    if (this.selectedGroup && this.selectedGroup.members) {
      this.managerService.removeUserFromGroup(this.managerUsername, this.selectedGroup.group_name, user).subscribe(
        (response) => {
          if (response.status === 'success') {
            // Update the members list without the removed user
            this.selectedGroup = {
              ...this.selectedGroup,
              members: this.selectedGroup.members?.filter((u: string) => u !== user) || []
            };
            this.responseMessage = 'User removed successfully!';
          } else {
            this.responseMessage = `Failed to remove user: ${response.message}`;
          }
        },
        (error) => {
          this.responseMessage = 'An error occurred while removing the user.';
          console.error('Error removing user:', error);
        }
      );
    } else {
      this.responseMessage = 'No group selected or no members to remove.';
    }
  }
}