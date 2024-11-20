import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../services/manager.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LogoutComponent } from '../logout/logout.component';
 
 
interface Group {
  _id: string;
  group_name: string;
  members: string[];
  manager: string;
  budget?: number;
  group_id: string;
}
 
@Component({
  selector: 'app-manager-updategroup',
  standalone: true,
  imports: [FormsModule, CommonModule, LogoutComponent],
  templateUrl: './manager-updategroup.component.html',
  styleUrl: './manager-updategroup.component.scss'
})
 
export class ManagerUpdateGroupComponent implements OnInit {
  managerUsername: string = '';
  managers: { username: string }[] = []; // List of manager usernames for the dropdown
  availableUsernames: string[] = [];
  groups: Group[] = [];
  selectedGroup: Group | null = null;
  newBudget: number | null = null;
  responseMessage: string = '';
  userToAdd: string = '';
  userToRemove: string = '';
  userAddErrorMessage: string | null = null;
  userRemoveErrorMessage: string | null = null;
  showLogoutPopup = false;
 
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
 
  navigateToCreateGroup() {
    this.router.navigate(['/create-group']);
  }
 
  fetchGroups() {
    this.managerService.getGroupsByManager(this.managerUsername).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.groups = response.data;
          this.responseMessage = '';
        } else {
          this.responseMessage = response.message;
        }
      },
      (error) => {
        this.responseMessage = 'An error occurred while fetching groups.';
      }
    );
  }
 
  onGroupSelect(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const groupName = selectElement.value;
 
    this.selectedGroup = this.groups.find(group => group.group_name === groupName) || null;
    this.responseMessage = '';
  }
 
  refreshGroupDetails() {
    if (this.selectedGroup) {
      this.managerService.getGroupsByManager(this.managerUsername).subscribe(
        (response) => {
          if (response.status === 'success') {
            const groupData = response.data.find((group: Group) => group.group_name === this.selectedGroup!.group_name);
            if (groupData) {
              this.selectedGroup = { ...this.selectedGroup, ...groupData };
              this.responseMessage = 'Group data refreshed successfully.';
            }
          } else {
            this.responseMessage = response.message;
          }
        },
        (error) => {
          this.responseMessage = 'An error occurred while refreshing the group data.';
        }
      );
    } else {
      this.responseMessage = 'No group selected to refresh.';
    }
  }
 
  updateBudget() {
    if (this.selectedGroup && this.newBudget && this.newBudget <= 5000) {
      this.managerService.updateGroupBudget(this.managerUsername, this.selectedGroup.group_name, this.newBudget).subscribe(
        (response) => {
          this.responseMessage = response.message;
        },
        (error) => {
          this.responseMessage = 'An error occurred while updating the budget.';
        }
      );
    } else if (this.newBudget && this.newBudget > 5000) {
      this.responseMessage = 'Budget cannot exceed 5000.';
    }
  }
 
  addUser() {
    if (this.selectedGroup && this.userToAdd.trim()) {
      const groupID = this.selectedGroup.group_id; // Use group_id instead of group_name
 
      this.managerService.addUserToGroup(this.managerUsername, groupID, this.userToAdd).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.selectedGroup!.members.push(this.userToAdd); // Update UI with new user
            this.userToAdd = ''; // Clear input field
            this.userAddErrorMessage = null;
            this.responseMessage = response.message; // Set success message
          } else {
            this.userAddErrorMessage = response.message; // Set error message from response
          }
        },
        (error) => {
          this.userAddErrorMessage = 'An error occurred while adding the user.'; // Set error message on failure
        }
      );
    }
  }
 
 
  removeUser() {
    if (this.selectedGroup && this.userToRemove.trim()) {
      const groupID = this.selectedGroup.group_id; // Use group_id instead of group_name
 
      this.managerService.removeUserFromGroup(this.managerUsername, groupID, this.userToRemove).subscribe(
        (response) => {
          if (response.status === 'success') {
            // Remove user from the local members list
            this.selectedGroup!.members = this.selectedGroup!.members.filter((u) => u !== this.userToRemove);
            this.userToRemove = ''; // Clear input field
            this.userRemoveErrorMessage = null;
            this.responseMessage = response.message; // Set success message
          } else {
            this.userRemoveErrorMessage = response.message; // Set error message from response
          }
        },
        (error) => {
          this.userRemoveErrorMessage = 'An error occurred while removing the user.'; // Set error message on failure
        }
      );
    }
  }

  toggleLogoutPopup() {
    this.showLogoutPopup = !this.showLogoutPopup;
  }

  handleLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}