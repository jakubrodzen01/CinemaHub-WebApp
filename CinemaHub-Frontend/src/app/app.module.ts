import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

import { AuthService } from './core/services/auth.service';
import { AuthGuard } from './core/services/auth.guard';
import { HeaderComponent } from './header/header.component';
import { AdvertsComponent } from './home/adverts/adverts.component';
import { ScheduleComponent } from './home/schedule/schedule.component';
import { AvailabilityComponent } from './home/availability/availability.component';
import { ProfileComponent } from './home/profile/profile.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AlertComponent } from './shared/components/alert/alert.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { EmployeeComponent } from './home/employee/employee.component';
import { DeleteConfirmationModalComponent } from './shared/components/modal/delete-confirmation-modal/delete-confirmation-modal.component';
import { CreateScheduleComponent } from './home/create-schedule/create-schedule.component';
import { MailComponent } from './home/mail/mail.component';

export function tokenGetter() {
  return localStorage.getItem('auth_token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    AdvertsComponent,
    ScheduleComponent,
    AvailabilityComponent,
    MailComponent,
    ProfileComponent,
    DashboardComponent,
    PageNotFoundComponent,
    AlertComponent,
    ModalComponent,
    EmployeeComponent,
    DeleteConfirmationModalComponent,
    CreateScheduleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:8080"],
        disallowedRoutes: ["http://localhost:8080/api/v1/user/authenticate"]
      }
    })
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
