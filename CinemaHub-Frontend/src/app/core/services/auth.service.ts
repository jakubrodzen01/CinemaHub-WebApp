import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Injectable } from "@angular/core";
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/user/authenticate';
  public tokenKey = 'auth_token';

  constructor(private http: HttpClient, private router: Router, public jwtHelper: JwtHelperService) { }

  login(username: string, password: string) {
    return this.http.post<any>(this.apiUrl, { username, password }).pipe(
      catchError(err => {
        console.error('Login error:', err);
        return of(null); // Zwraca null w przypadku błędu
      })
    );
  }

  getMe() {
    return this.http.get<any>('http://localhost:8080/api/v1/user/getMe').pipe(
      catchError(err => {
        console.error('GetMe error:', err);
        return of(null); // Zwraca null w przypadku błędu
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('username');
    localStorage.removeItem('me');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    const token = localStorage.getItem(this.tokenKey);
    return token && !this.jwtHelper.isTokenExpired(token);
  }
}
