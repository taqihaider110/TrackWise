import { Component } from '@angular/core';
import { NavService } from '../../../services/nav.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent{

  constructor(private nav: NavService) {}
  gotoSignUp(){
    this.nav.push('/auth/signup');
  }

  skip() {
    this.nav.push('/home');
  }
}
