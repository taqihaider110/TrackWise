import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-pie-chart',
  imports: [CommonModule, ChartModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent implements OnChanges {
  @Input() pieChartData: any; // Input for chart data
  @Input() currentMonthName: string = ''; // Input for the current month name
  @Input() currentYear: number = new Date().getFullYear(); // Input for the current year
  @Input() isIncome: boolean = false; // Input to determine if the chart is for income or expenses
  @Output() monthChanged = new EventEmitter<number>(); // EventEmitter to notify parent of month change

  pieChartOptions: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pieChartData'] || changes['isIncome']) {
      this.initializeChartOptions();
    }
  }

  initializeChartOptions(): void {
    const colors = this.generateColors();

    this.pieChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 1.1,
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#fff'
          }
        }
      },
      datasets: [
        {
          backgroundColor: colors,
          hoverBackgroundColor: colors.map(color => this.adjustColorBrightness(color, 20)) // Slightly brighter on hover
        }
      ]
    };
  }

  generateColors(): string[] {
    // Generate shades of blue for income or red for expenses
    if (this.isIncome) {
      return ['#42A5F5', '#64B5F6', '#90CAF9', '#BBDEFB', '#E3F2FD']; // Shades of blue
    } else {
      return ['#FF6384', '#FF8394', '#FFA3A4', '#FFC3C4', '#FFE3E4']; // Shades of red
    }
  }

  adjustColorBrightness(color: string, amount: number): string {
    // Adjust the brightness of a hex color
    let usePound = false;
    if (color[0] === '#') {
      color = color.slice(1);
      usePound = true;
    }

    const num = parseInt(color, 16);
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00ff) + amount;
    let b = (num & 0x0000ff) + amount;

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return (usePound ? '#' : '') + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  }

  previousMonth(): void {
    this.monthChanged.emit(-1); // Emit -1 to indicate moving to the previous month
  }

  nextMonth(): void {
    this.monthChanged.emit(1); // Emit 1 to indicate moving to the next month
  }

  isNextDisabled(): boolean {
    const today = new Date();
    return this.currentMonthName === this.getMonthName(today.getMonth()) && this.currentYear === today.getFullYear();
  }

  private getMonthName(monthIndex: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthIndex];
  }
}
