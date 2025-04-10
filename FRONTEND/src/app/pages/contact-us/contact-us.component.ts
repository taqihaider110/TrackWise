import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { HomeNavbarComponent } from '../../components/home-navbar/home-navbar.component';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-contact-us',
  imports: [HeaderComponent, HomeNavbarComponent, BreadcrumbComponent, FooterComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {

}
