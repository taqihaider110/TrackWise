import { Component } from '@angular/core';
import { NavService } from '../../../services/nav.service';

@Component({
  selector: 'app-signup',
  imports: [],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  constructor(private nav: NavService) {}

  gotoLogIn(){
    this.nav.push('/auth/login');
  }
}
