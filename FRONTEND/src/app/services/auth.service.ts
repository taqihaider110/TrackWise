import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  private sessionTimer: any;

  constructor(private api: ApiService, private client: HttpClient, private router:Router, private snackBar: MatSnackBar,) {}

  login(obj: any): Promise<boolean> {
    return new Promise((resolve) => {
      this.api.loginUserApi(obj).subscribe({
        next: (res: any) => {
          // console.log('Login success:', res);

          const token = res.token;
          const expiration = new Date().getTime() + 3600 * 1000; // time:  1 hour from now

          // Store token and expiration in localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('tokenExpiration', expiration.toString());

          this.isAuthenticated = true;
          this.startSessionTimer();
          resolve(true);
        },
        error: () => {
          this.isAuthenticated = false;
          resolve(false);
        },
      });
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    this.isAuthenticated = false;

    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
    this.router.navigate(['/auth']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('tokenExpiration');

    if (!token || !expiration) {
      return false;
    }

    const now = new Date().getTime();
    if (now > parseInt(expiration, 10)) {
      this.logout();  
      return false;
    }

    return true;
  }

  startSessionTimer(): void {
    const expiration = localStorage.getItem('tokenExpiration');
    if (expiration) {
      const timeLeft = parseInt(expiration, 10) - new Date().getTime();
      this.sessionTimer = setTimeout(() => {
        this.logout();
        this.snackBar.open('Session Timed Out!', '', {
          duration: 1000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }, timeLeft);
    }
  }

  signUp(obj: any): Promise<{ success: boolean; message?: string }> {
    return new Promise((resolve) => {
      this.api.signUpUserApi(obj).subscribe({
        next: (res: any) => {
          console.log('Signup success:', res);
          resolve({ success: true });
        },
        error: (err) => {
          console.error('Signup error:', err);
          const errorMessage = err.error?.message || 'Something went wrong';
          resolve({ success: false, message: errorMessage });
        },
      });
    });
  }
}
