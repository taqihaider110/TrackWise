import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-line-chart',
  imports: [ChartModule, RouterModule, CommonModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss'
})
export class LineChartComponent {
  @Input() chartData: any;
  @Input() routerLinkPath: string = '';
  @Input() label: string = '';
  @Input() isDashboard: boolean = false;

  chartOptions: any;

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.chartData);
    if (changes['chartData'] && changes['chartData'].currentValue) {
      this.initializeChartOptions();
    }
  }

  initializeChartOptions(): void {
    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 1.2,
      responsive: true,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: '#fff'
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
