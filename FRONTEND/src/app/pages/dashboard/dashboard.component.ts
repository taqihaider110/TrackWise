import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { CommonModule } from '@angular/common';
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { ChartModule } from 'primeng/chart';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, BreadcrumbComponent, CommonModule, SideBarComponent, ChartModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'

})
export class DashboardComponent {
  chartData: any;
  chartOptions: any;

  ngOnInit() {
    this.chartData = {
      labels: ['January', 'February', 'March', 'April'],
      datasets: [
        {
          label: 'Income',
          backgroundColor: '#02EA77',
          borderColor: '#02EA77',
          data: [65, 59, 80, 81,100],
        },
      ],
    };

    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 1.2,
      responsive: true,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: '#fff' // for dark theme
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#fff' },
          grid: { color: '#fff' },
          title: {
            display: true,
            text: 'Months',
            color: '#fff',
            font: {
              family: 'Poppins',
              size: 20,
              weight: 'bold'
            }
          }
        },
        y: {
          ticks: { color: '#fff' },
          grid: { color: '#fff' },
          title: {
            display: true,
            // text: '$',

            color: '#fff',
            font: {
              family: 'Poppins',
              size: 20,
              weight: 'bold'
            }
          }
        }
      }
    };
  }
}
