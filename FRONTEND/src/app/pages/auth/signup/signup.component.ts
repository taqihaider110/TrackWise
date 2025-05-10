import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  // constructor(private nav: NavService) {}

  // gotoLogIn(){
  //   this.nav.push('/auth/login');
  // }

  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  signUp() {
    if (
      this.username.trim() === '' ||
      this.email.trim() === '' ||
      this.password.trim() === '' ||
      this.confirmPassword.trim() === ''
    ) {
      this.snackBar.open('Fields are empty', '', {
        duration: 2000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.snackBar.open('Passwords do not match', '', {
        duration: 2000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
      return;
    }

    let obj = {
      username: this.username,
      email: this.email,
      password: this.password,
    };

    this.authService.signUp(obj).then((result) => {
      if (result.success) {
        this.snackBar.open('User created successfully', '', {
          duration: 2000,
          panelClass: ['snackbar-success'],
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.router.navigate(['/auth/login']);
      } else {
        this.snackBar.open(result.message || 'Signup failed', '', {
          duration: 2000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

}
