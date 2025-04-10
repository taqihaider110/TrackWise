import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-income',
  imports: [HeaderComponent, SideBarComponent, BreadcrumbComponent],
  templateUrl: './income.component.html',
  styleUrl: './income.component.scss'
})
export class IncomeComponent {

}
