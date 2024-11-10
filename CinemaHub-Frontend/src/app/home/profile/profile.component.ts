import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/core/services/employee.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile: any = {};
  userId: string | null = null;
  http: any;
  dataLoaded: boolean = false;
  

  constructor(private employeeService: EmployeeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('idUser');
      if (this.userId) {
        this.loadEmployeeProfile(this.userId);
      } else {
        this.loadUserData();
      }
    });
  }

  loadUserData() {
    const userData = localStorage.getItem('me');
    if (userData) {
      const me = JSON.parse(userData);
      this.userProfile = me;
      this.dataLoaded = true;
    }
  }

  loadEmployeeProfile(id: string) {
    this.employeeService.getById(id).subscribe(
      (employee: any) => {
        this.userProfile = employee;
        this.dataLoaded = true;
      },
      (error: any) => {
        console.error('Error loading employee:', error);
      }
    );
  }
}
