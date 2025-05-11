import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-one',
  imports: [],
  templateUrl: './hero-one.component.html',
  styleUrl: './hero-one.component.scss'
})
export class HeroOneComponent {
 isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  changeStatus() {
    if(this.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
    else{
      this.router.navigate(['/auth/signup']);
    }
  }
}
