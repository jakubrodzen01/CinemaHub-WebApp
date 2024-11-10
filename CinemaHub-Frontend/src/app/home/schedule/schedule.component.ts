import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { format, subDays, addDays, parse } from 'date-fns';
import {Router} from "@angular/router";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface Shift {
  startTime: string;
  endTime: string;
  shiftDate: string;
  place: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  shifts: { [key: string]: Shift[] } = {};
  daysOfWeek: string[] = [];
  places: string[] = ['SERVICE', 'BAR', 'CAFE'];
  role: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.initializeWeek();
    this.loadShifts();
    this.loadUserRole();
  }

  initializeWeek() {
    const today = new Date();
    const friday = subDays(today, (today.getDay() + 2) % 7);
    for (let i = 0; i < 7; i++) {
      this.daysOfWeek.push(format(addDays(friday, i), 'yyyy-MM-dd'));
    }
  }

  loadShifts() {
    this.daysOfWeek.forEach(date => {
      this.http.get<Shift[]>(`http://localhost:8080/api/v1/shift/getByDate/${date}`).subscribe(
        (shifts: Shift[]) => {
          this.shifts[date] = this.sortShifts(shifts);
        },
        error => {
          console.error(`Error loading shifts for date ${date}:`, error);
          this.shifts[date] = [];
        }
      );
    });
  }

  loadUserRole() {
    const userData = localStorage.getItem('me');
    if (userData) {
      const me = JSON.parse(userData);
      this.role = me.role;
    }
  }

  sortShifts(shifts: Shift[]): Shift[] {
    return shifts.sort((a, b) => {
      if (a.place === b.place) {
        const aStartTime = parse(a.startTime, 'HH:mm', new Date());
        const bStartTime = parse(b.startTime, 'HH:mm', new Date());
        return aStartTime.getTime() - bStartTime.getTime();
      }
      return this.places.indexOf(a.place) - this.places.indexOf(b.place);
    });
  }

  downloadSchedule() {
    const data = document.getElementById('schedule-container');
    
    if (data) {
      html2canvas(data).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const startDate = format(parse(this.daysOfWeek[0], 'yyyy-MM-dd', new Date()), 'dd');
        const endDate = format(parse(this.daysOfWeek[6], 'yyyy-MM-dd', new Date()), 'dd.MM.yyyy');
        const fileName = `schedule_${startDate}-${endDate}.pdf`;
        
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(fileName);
      });
    }
  }

  navigateToCreateSchedule() {
    this.router.navigate(['/home/create-schedule']);
  }
}
