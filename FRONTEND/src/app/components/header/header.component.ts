import { Component, Input } from '@angular/core';
import { NavService } from '../../services/nav.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() isHome!: boolean;

  constructor(private nav: NavService) {
    this.isHome = false;
  }

  gotoLogIn() {
    this.nav.push('/dashboard');
  }
  gotoProfile() {
    this.nav.push('/profile');
  }
}
