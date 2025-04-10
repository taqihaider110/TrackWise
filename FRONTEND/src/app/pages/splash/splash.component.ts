import { Component, OnInit } from '@angular/core';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'app-splash',
  imports: [],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.scss',
})
export class SplashComponent implements OnInit {

  constructor(private nav: NavService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.nav.push('/home');
    }, 3000);
  }
}
