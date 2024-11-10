import { format, parse } from 'date-fns'; 
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Shift } from '../schedule/schedule.component';

interface Weather {
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  name: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  welcomeMessage: string = '';
  currentDate: Date = new Date();
  firstName: string = '';
  lastName: string = '';
  weather: Weather | null = null;
  apiKey: string = 'b0d65b7ecdd291c1e43810539b10f5a0';
  places: string[] = ['SERVICE', 'BAR', 'CAFE'];
  todayShifts: Shift[] = [];

  currentTime: Date = new Date();
  private timeInterval: any;
  hourRotation: string = '';
  minuteRotation: string = '';
  secondRotation: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadUserData();
    this.generateWelcomeMessage();
    this.getLocation();
    this.loadTodayShifts();

    this.timeInterval = setInterval(() => {
      this.updateClock();
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  loadUserData() {
    const userData = localStorage.getItem('me');
    if (userData) {
      const me = JSON.parse(userData);
      this.firstName = me.firstName;
      this.lastName = me.lastName;
    }
  }

  generateWelcomeMessage() {
    this.welcomeMessage = `Welcome, ${this.firstName} ${this.lastName}!`;
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.getWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  getWeather(lat: number, lon: number) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
    this.http.get<Weather>(url).subscribe(
      (data) => {
        this.weather = data;
      },
      (error) => {
        console.error('Error fetching weather data', error);
      }
    );
  }

  loadTodayShifts() {
    const today = format(this.currentDate, 'yyyy-MM-dd');
    this.http.get<Shift[]>(`http://localhost:8080/api/v1/shift/getByDate/${today}`).subscribe(
      (shifts: Shift[]) => {
        this.todayShifts = this.sortShifts(shifts);;
      },
      error => {
        console.error(`Error loading today's shifts:`, error);
        this.todayShifts = [];
      }
    );
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

  updateClock() {
    this.currentTime = new Date();
    
    const hours = this.currentTime.getHours();
    const minutes = this.currentTime.getMinutes();
    const seconds = this.currentTime.getSeconds();

    const hourAngle = (hours % 12) * 30 + (minutes / 60) * 30;
    this.hourRotation = `rotate(${hourAngle}deg)`;

    const minuteAngle = minutes * 6 + (seconds / 60) * 6;
    this.minuteRotation = `rotate(${minuteAngle}deg)`;

    const secondAngle = seconds * 6;
    this.secondRotation = `rotate(${secondAngle}deg)`;
  }
}
