import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './core/services/auth.guard';
import {AdvertsComponent} from "./home/adverts/adverts.component";
import {ScheduleComponent} from "./home/schedule/schedule.component";
import {AvailabilityComponent} from "./home/availability/availability.component";
import {ProfileComponent} from "./home/profile/profile.component";
import {DashboardComponent} from "./home/dashboard/dashboard.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {EmployeeComponent} from "./home/employee/employee.component";
import {CreateScheduleComponent} from "./home/create-schedule/create-schedule.component";
import { MailComponent } from './home/mail/mail.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard' },
      { path: 'profile', component: ProfileComponent, title: 'My Profile' },
      { path: 'schedule', component: ScheduleComponent, title: 'Schedule' },
      { path: 'create-schedule', component: CreateScheduleComponent, title: 'Create Schedule'},
      { path: 'adverts', component: AdvertsComponent, title: 'Adverts' },
      { path: 'availability', component: AvailabilityComponent, title: 'Availability' },
      { path: 'mail', component: MailComponent, title: 'Mail' },
      { path: 'employee', component: EmployeeComponent, title: 'Employee List' },
      { path: 'employee/:idUser', component: ProfileComponent, title: 'Profile' },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ] },
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
