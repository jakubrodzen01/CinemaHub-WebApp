import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mail } from '../models/mail';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private apiUrl = 'http://localhost:8080/api/v1/mails';

  constructor(private http: HttpClient) { }

    addMail(mail: Mail): Observable<any> {
      const token = localStorage.getItem('auth_token');
      const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
      return this.http.post<any>(`${this.apiUrl}/add`, mail, { headers });
    }

    getRecivedMails(): Observable<any> {
      const token = localStorage.getItem('auth_token');
      const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
      return this.http.get<any>(`${this.apiUrl}/getAll`, { headers });
    }

    getSentMails(): Observable<any> {
      const token = localStorage.getItem('auth_token');
      const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
      return this.http.get<any>(`${this.apiUrl}/getAllSent`, { headers });
    }
}
