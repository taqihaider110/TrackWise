import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  imports: [CommonModule]
})
export class SideBarComponent{
  isOpen = false;

  constructor(private nav: NavService) {}

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
  gotoHome() {
    this.nav.push('/home');
  }

  gotoDashboard() {
    this.nav.push('/dashboard');
    console.log('Navigating to Dashboard');
  }

  gotoExpenses() {
    this.nav.push('/expenses');
  }

  gotoIncome() {
    this.nav.push('/income');
  }
}
