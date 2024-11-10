import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Mail } from 'src/app/core/models/mail';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { MailService } from 'src/app/core/services/mail.service';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent {
  dataLoaded: boolean = false;
  receivedMails: any[] = [];
  sentMails: any[] = [];
  newMail: Mail = {
    idRecipient: '',
    title: '',
    text: ''
  };
  employees: any[] = [];

  constructor(private employeeService: EmployeeService, private mailService: MailService, private router: Router) {}

  ngOnInit(): void {
    this.loadMails();
    this.loadRecivedMails();
    this.loadSentMails();
    this.loadUsers();
  }

  loadUsers(): void {
    this.employeeService.getAll().subscribe(
      (employees: any) => {
        this.employees = employees.sort((a: any, b: any) => a.lastName.localeCompare(b.lastName));
      },
      (error: any) => {
        console.error('Error loading employees:', error);
      }
    );
  }

  loadRecivedMails(): void {
    this.mailService.getRecivedMails().subscribe(
      (mails: any[]) => {
        this.receivedMails = mails.sort((a, b) => new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime());
      },
      (error: any) => {
        console.log('Error loading recived mails: ', error);
      }
    );
  }

  loadSentMails(): void {
    this.mailService.getSentMails().subscribe(
      (mails: any[]) => {
        this.sentMails = mails.sort((a, b) => new Date(b.sendDate).getTime() - new Date(a.sendDate).getTime());
      },
      (error: any) => {
        console.log('Error loading sent mails: ', error);
      }
    );
  }

  loadMails(): void {
    this.dataLoaded = true;
  }

  sendMail(): void {
    this.mailService.addMail(this.newMail).subscribe(
      (mail: any) => {
        this.newMail = {
          idRecipient: '',
          title: '',
          text: ''
        }
      },
      (error: any) => {
        console.error('Error sending mail:', error);
      }
    );
  }
}
