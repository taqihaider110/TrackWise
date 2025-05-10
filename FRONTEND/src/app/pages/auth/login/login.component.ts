import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'], // fixed `styleUrl` to `styleUrls` (must be an array)
  imports: [FormsModule, RouterModule, CommonModule],
})
export class LoginComponent {
  // username: string = '';
  // password: string = '';
  // errorMessage: string = '';

  // constructor(
  //   private authService: AuthService,
  //   private nav: NavService
  // ) {}

  // login() {
  //   this.authService.login(this.username, this.password).subscribe({
  //     next: () => {
  //       console.log('Login successful!');
  //       this.nav.push('/home'); // navigate to home after login
  //     },
  //     error: (err) => {
  //       console.error('Login failed:', err);
  //       this.errorMessage = err.message || 'Invalid credentials';
  //     }
  //   });
  // }

  // gotoSignUp() {
  //   this.nav.push('/auth/signup');
  // }

  // skip() {
  //   this.nav.push('/home');
  // }

  email: string = '';
  password: string = '';
  showPassword: boolean = false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async checkUser() {
    let obj = {
      email: this.email,
      password: this.password
    };

    let success = await this.authService.login(obj);

    if (success) {
      this.snackBar.open('Login successful!', '', {
        duration: 1000,
        panelClass: ['snackbar-success'],
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1000);

    } else {
      this.snackBar.open('Incorrect email or password.', '', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
