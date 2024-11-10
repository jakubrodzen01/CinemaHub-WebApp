import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/api/v1/user';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    const token = localStorage.getItem('auth_token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    return this.http.get<any[]>(`${this.apiUrl}/getAll`, { headers });
  }

  getById(id: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    return this.http.get<any>(`${this.apiUrl}/getById/${id}`, { headers });
  }

  deleteById(id: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`, { headers });
  }

  addEmployee(employee: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
    return this.http.post<any>(`${this.apiUrl}/add`, employee, { headers });
  }
}
