import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { FeaturesComponent } from "./features/features.component";
import { HeroOneComponent } from "./hero-one/hero-one.component";
import { AboutUsComponent } from "./about-us/about-us.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { HomeNavbarComponent } from '../../components/home-navbar/home-navbar.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, BreadcrumbComponent, FeaturesComponent, HeroOneComponent, HomeNavbarComponent, AboutUsComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
