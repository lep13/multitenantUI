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
  selector: 'app-manager',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.scss'
})

export class ManagerComponent implements OnInit {
  groups: Group[] = [];

  constructor(private managerService: ManagerService) {}

  ngOnInit(): void {
    this.managerService.getGroups().subscribe(
      (data) => {
        console.log('Groups received:', data); // Log data for debugging
        this.groups = data;
      },
      (error) => {
        console.error('Error fetching groups:', error);
      }
    );
  }
}