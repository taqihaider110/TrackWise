import { Component } from '@angular/core';
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { HeaderComponent } from "../../components/header/header.component";
import { HomeNavbarComponent } from '../../components/home-navbar/home-navbar.component';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-about-us',
  imports: [BreadcrumbComponent, HomeNavbarComponent, HeaderComponent, FooterComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {

}
