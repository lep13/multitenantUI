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

export class ManagerUpdateGroupComponent implements OnInit {
  managerUsername: string = '';
  groups: Group[] = [];
  selectedGroup: Group | null = null;
  newBudget: number | null = null;
  responseMessage: string = '';
  userToAdd: string = '';
  userToRemove: string = '';
  
  constructor(private managerService: ManagerService) {}

  ngOnInit(): void {}

  fetchGroups() {
    this.managerService.getGroupsByManager(this.managerUsername).subscribe(
      (response) => {
        console.log('API Response:', response); // Log full response
  
        if (response.status === 'success') {
          this.groups = response.data;
          console.log('Groups array:', this.groups); // Log groups to check if data is populated
          this.responseMessage = '';
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

  onGroupSelect(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const groupName = selectElement.value;
  
    if (groupName) {
      this.selectedGroup = this.groups.find(group => group.group_name === groupName) ?? null;
    } else {
      this.selectedGroup = null;
    }
  
    this.responseMessage = ''; // Clear any previous messages
  }  
  
  refreshGroupDetails() {
    // Check if `selectedGroup` is defined early in the function
    if (!this.selectedGroup) {
      this.responseMessage = 'No group selected to refresh.';
      return;
    }
  
    this.managerService.getGroupsByManager(this.managerUsername).subscribe(
      (response) => {
        if (response.status === 'success') {
          // Explicitly cast `response.data` to an array of `Group` to ensure proper type inference
          const groupData = (response.data as Group[]).find((group) => group.group_name === this.selectedGroup!.group_name);
          if (groupData) {
            // Update `selectedGroup` fields with new data using non-null assertion
            this.selectedGroup = {
              _id: groupData._id || this.selectedGroup!._id,
              group_name: groupData.group_name || this.selectedGroup!.group_name,
              manager: groupData.manager || this.selectedGroup!.manager,
              budget: groupData.budget ?? 0,
              members: groupData.members?.length ? groupData.members : ['No users present in group']
            };
            this.responseMessage = 'Group data refreshed successfully.';
          } else {
            this.responseMessage = 'No matching group found.';
          }
        } else {
          this.responseMessage = `Failed to fetch group details: ${response.message}`;
        }
      },
      (error) => {
        this.responseMessage = 'An error occurred while refreshing the group data.';
      }
    );
  }  

  // onSelectGroup(event: Event) {
  //   const selectElement = event.target as HTMLSelectElement;
  //   const selectedGroupName = selectElement.value;
  
  //   // Find the selected group object based on the selected group name
  //   this.selectedGroup = this.groups.find(group => group.group_name === selectedGroupName) || null;
  
  //   if (this.selectedGroup) {
  //     console.log('Selected group:', this.selectedGroup);
  //     this.responseMessage = `Selected group: ${this.selectedGroup.group_name}`;
  //   } else {
  //     this.responseMessage = 'No group selected.';
  //   }
  // }  

  updateBudget() {
    if (this.selectedGroup && this.newBudget !== null) {
      this.managerService.updateGroupBudget(this.managerUsername, this.selectedGroup.group_name, this.newBudget).subscribe(
        (response) => {
          this.responseMessage = response.status === 'success'
            ? `Budget updated successfully for ${this.selectedGroup!.group_name}.`
            : `Failed to update budget: ${response.message}`;
        },
        (error) => {
          this.responseMessage = 'An error occurred while updating the budget.';
        }
      );
    }
  }

  addUser() {
    if (this.selectedGroup && this.userToAdd.trim()) {
      // Call addUserToGroup with separate arguments instead of a single object
      this.managerService.addUserToGroup(this.managerUsername, this.selectedGroup.group_name, this.userToAdd).subscribe(
        (response) => {
          this.responseMessage = response.message;
          this.userToAdd = ''; // Clear input field after success
          this.selectedGroup?.members.push(this.userToAdd); // Update local members list
        },
        (error) => {
          this.responseMessage = 'An error occurred while adding the user.';
          console.error(error);
        }
      );
    } else {
      this.responseMessage = 'Please enter a valid username to add.';
    }
  }  

  removeUser() {
    if (this.selectedGroup && this.userToRemove.trim()) {
      this.managerService.removeUserFromGroup(this.managerUsername, this.selectedGroup.group_name, this.userToRemove).subscribe(
        (response) => {
          if (response.message === 'User removed from group successfully') {
            this.selectedGroup!.members = this.selectedGroup!.members.filter(u => u !== this.userToRemove);
            this.responseMessage = `User ${this.userToRemove} removed successfully from ${this.selectedGroup!.group_name}.`;
            this.userToRemove = ''; // Clear the input
          } else {
            this.responseMessage = `Failed to remove user: ${response.message}`;
          }
        },
        (error) => {
          this.responseMessage = 'An error occurred while removing the user.';
        }
      );
    } else {
      this.responseMessage = 'Please enter a user to remove.';
    }
  }
}  