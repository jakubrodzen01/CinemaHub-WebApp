import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.username, this.password).subscribe(response => {
      if (response) {
        const token = response.token;
        if (token) {
          const decodedToken = this.authService.jwtHelper.decodeToken(token);
          const username = decodedToken.sub;

          localStorage.setItem(this.authService.tokenKey, token);
          localStorage.setItem('username', username);

          this.authService.getMe().subscribe(me => {
            if (me) {
              localStorage.setItem('me', JSON.stringify(me));
              localStorage.setItem('role', me.role);
              this.router.navigate(['/home']);
            }
          });
        } else {
          this.errorMessage = 'Authentication failed: Token not found.';
        }
      } else {
        this.errorMessage = 'Login failed. Invalid Username or password.';
      }
    });
  }
}
