import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { format, addDays, subDays, isSameDay, parseISO } from 'date-fns';
import { Router } from '@angular/router';

export interface Shift {
  username: string;
  startTime: string;
  endTime: string;
  place: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export interface ShiftDto {
  username: string;
  startTime: string;
  endTime: string;
  place: string;
  shiftDate: string;
}

export interface Availability {
  id_availability: string;
  user: {
    idUser: string;
    firstName: string;
    lastName: string;
    username: string;
    role: string;
  };
  availabilityStartDate: string;
  friday: string;
  saturday: string;
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  [key: string]: any;
}

@Component({
  selector: 'app-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.css']
})
export class CreateScheduleComponent implements OnInit {
  shifts: { [key: string]: Shift[] } = {};
  daysOfWeek: string[] = [];
  places: string[] = ['SERVICE', 'BAR', 'CAFE'];
  times: string[] = [];
  availabilityData: Availability[] = [];
  thisWeekAvailability: Availability[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.initializeWeek();
    this.generateTimes();
    this.loadAvailability();
  }

  initializeWeek() {
    const today = new Date();
    const nextFriday = addDays(subDays(today, (today.getDay() + 2) % 7), 7);
    this.daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      this.daysOfWeek.push(format(addDays(nextFriday, i), 'yyyy-MM-dd'));
      this.shifts[this.daysOfWeek[i]] = [];
    }
  }

  generateTimes() {
    for (let hour = 0; hour <= 23; hour++) {
      const formattedTime = `${hour.toString().padStart(2, '0')}:00`;
      this.times.push(formattedTime);
    }
  }

  loadAvailability() {
    this.http.get<Availability[]>('http://localhost:8080/api/v1/availability/getAll').subscribe(
      (data: Availability[]) => {
        this.availabilityData = data;
        this.filterThisWeekAvailability();
      },
      error => console.error('Error loading availability data:', error)
    );
  }

  filterThisWeekAvailability() {
    const startOfWeek = parseISO(this.daysOfWeek[0]);
    const endOfWeek = parseISO(this.daysOfWeek[this.daysOfWeek.length - 1]);

    this.thisWeekAvailability = this.availabilityData.filter(availability => {
      const availabilityDate = parseISO(availability.availabilityStartDate);
      return availabilityDate >= startOfWeek && availabilityDate <= endOfWeek;
    });
  }

  addShift(day: string) {
    const newShift: Shift = {
      username: "",
      startTime: this.times[0],
      endTime: this.times[0],
      place: this.places[0],
      user: { firstName: '', lastName: '' }
    };
    this.shifts[day].push(newShift);
  }

  removeShift(day: string, shift: Shift) {
    this.shifts[day] = this.shifts[day].filter(s => s !== shift);
  }

  saveSchedule() {
    for (const day of this.daysOfWeek) {
      for (const shift of this.shifts[day]) {
        const shiftToSend = {
          username: shift.username,
          startTime: shift.startTime,
          endTime: shift.endTime,
          shiftDate: day,
          place: shift.place,
        };

        this.http.post('http://localhost:8080/api/v1/shift/add', shiftToSend)
          .subscribe(
            response => {
              console.log('Shift saved successfully');
            },
            error => console.error('Error saving shift:', error)
          );
      }
    }
  }

  getAvailabilityForDay(day: string): { user: any; hours: string }[] {
    const formattedDay = format(parseISO(day), 'eeee').toLowerCase();
  
    return this.thisWeekAvailability
      .filter(availability => availability[formattedDay] && availability[formattedDay] !== '-')
      .map(availability => ({
        user: availability.user,
        hours: availability[formattedDay]
      }));
  }  
}
