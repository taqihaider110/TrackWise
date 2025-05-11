import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-total-card',
  imports: [CommonModule],
  templateUrl: './total-card.component.html',
  styleUrl: './total-card.component.scss',
})
export class TotalCardComponent {
  @Input() title!: string;
  @Input() currentMonthName!: string;
  @Input() currentYear!: number;
  private _total!: number;

  @Input()
  set total(value: number) {
    this._total = Math.floor(value * 1000) / 1000; // Truncate after the third decimal place
  }

  get total(): number {
    return this._total;
  }
  
  @Output() monthChanged = new EventEmitter<number>();

  previousMonth(): void {
    this.monthChanged.emit(-1); // Emit -1 to indicate moving to the previous month
  }

  nextMonth(): void {
    this.monthChanged.emit(1); // Emit 1 to indicate moving to the next month
  }

  isNextDisabled(): boolean {
    const today = new Date();
    return (
      this.currentMonthName === this.getMonthName(today.getMonth()) &&
      this.currentYear === today.getFullYear()
    );
  }

  private getMonthName(monthIndex: number): string {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return monthNames[monthIndex];
  }
}
