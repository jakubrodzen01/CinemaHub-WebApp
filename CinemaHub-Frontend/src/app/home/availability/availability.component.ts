import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit {
  availabilityForm: FormGroup;
  daysOfWeek: string[] = ['friday', 'saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday'];
  isEmployee: boolean = false;
  isManager: boolean = false;
  availabilityAdded: boolean = false;
  availabilities: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.availabilityForm = this.fb.group({
      friday: [''],
      saturday: [''],
      sunday: [''],
      monday: [''],
      tuesday: [''],
      wednesday: [''],
      thursday: ['']
    });
  }

  ngOnInit(): void {
    this.checkRole();
    if (this.isManager) {
      this.loadAvailabilities();
    } else if (this.isEmployee) {
      this.checkIfAvailabilityExists();
    }
  }

  checkRole() {
    const role = localStorage.getItem('role');
    this.isEmployee = role === 'EMPLOYEE';
    this.isManager = role === 'MANAGER';
  }

  isFormDisabled(): boolean {
    const today = new Date();
    const dayOfWeek = today.getDay();
    return dayOfWeek === 3 || dayOfWeek === 4; // Disable form on Wednesday (3) and Thursday (4)
  }

  addAvailability() {
    if (this.availabilityForm.valid) {
      const token = localStorage.getItem('auth_token');
      this.http.post('http://localhost:8080/api/v1/availability/add', this.availabilityForm.value, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe(
        () => {
          this.availabilityAdded = true;
        },
        error => {
          if (error.status === 409) { // Conflict
            console.error('Availability already exists', error);
          } else {
            console.error('Error adding availability', error);
          }
        }
      );
    }
  }

  checkIfAvailabilityExists() {
    const token = localStorage.getItem('auth_token');
    const userId = JSON.parse(localStorage.getItem('me')!).idUser;
    this.http.get(`http://localhost:8080/api/v1/availability/getById/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (availability: any) => {
        if (availability) {
          this.availabilityAdded = true;
          this.availabilityForm.patchValue(availability);
        }
      },
      error => {
        console.error('Error checking availability', error);
      }
    );
  }

  loadAvailabilities() {
    const token = localStorage.getItem('auth_token');
    this.http.get<any[]>('http://localhost:8080/api/v1/availability/getAll', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      data => {
        this.availabilities = data;
      },
      error => {
        console.error('Error loading availabilities', error);
      }
    );
  }
}
