import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdvertsService {
  private apiUrl = 'http://localhost:8080/api/v1/adverts';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAll`);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getById/${id}`);
  }

  addAdvert(advert: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, advert);
  }

  deleteById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }
}
