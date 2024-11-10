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
  groups: Group[] = [];
  selectedGroup: Group | null = null;
  newBudget: number | null = null;
  responseMessage: string | null = null;

  constructor(private managerService: ManagerService) {}

  fetchGroups() {
    this.managerService.listGroups(this.managerUsername).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.groups = response.data;
          this.responseMessage = null;
        } else {
          this.responseMessage = `An error occurred: ${response.message}`;
        }
      },
      (error) => {
        console.error('Error fetching groups:', error);
        this.responseMessage = 'An error occurred while fetching groups.';
      }
    );
  }

  onSelectGroup(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedGroupId = selectElement.value;
    this.selectedGroup = this.groups.find(group => group._id === selectedGroupId) || null;
    this.newBudget = this.selectedGroup?.budget || null;
  }

  updateBudget() {
    if (!this.selectedGroup) {
      this.responseMessage = 'Please select a group before updating the budget.';
      return;
    }
    if (this.newBudget !== null) {
      this.managerService.updateGroupBudget(this.selectedGroup.manager, this.selectedGroup.group_name, this.newBudget).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.responseMessage = `Budget updated successfully for ${this.selectedGroup!.group_name}.`;
          } else {
            this.responseMessage = `Failed to update budget: ${response.message}`;
          }
        },
        (error) => {
          console.error('Error updating budget:', error);
          this.responseMessage = 'An error occurred while updating the budget.';
        }
      );
    }
  }
  
  removeUser(user: string) {
    if (!this.selectedGroup) {
      this.responseMessage = 'Please select a group before removing users.';
      return;
    }
    this.managerService.removeUserFromGroup(this.selectedGroup.manager, this.selectedGroup.group_name, user).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.selectedGroup!.members = this.selectedGroup!.members.filter((u) => u !== user);
          this.responseMessage = `User ${user} removed successfully from ${this.selectedGroup!.group_name}.`;
        } else {
          this.responseMessage = `Failed to remove user: ${response.message}`;
        }
      },
      (error) => {
        console.error('Error removing user:', error);
        this.responseMessage = 'An error occurred while removing the user.';
      }
    );
  }
}  