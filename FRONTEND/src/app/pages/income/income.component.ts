import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';
import { FormsModule } from '@angular/forms';
import { PieChartComponent } from "../../components/pie-chart/pie-chart.component";
import { IncomesService } from '../../services/incomes.service';
import { AddIncomeModalComponent } from './add-income-modal/add-income-modal.component';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-income',
  imports: [
    HeaderComponent,
    SideBarComponent,
    BreadcrumbComponent,
    CommonModule,
    LineChartComponent,
    FormsModule,
    PieChartComponent
  ],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent {
  selectedMonthYear: string = '';
  recentIncome: any[] = [];
  hasData: boolean = true;
  incomeChartData: any;

  currentMonthIndex: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();

  incomePieChartData: any;
  totalMonthlyIncome: number = 0;

  showAll: boolean = false;

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    private incomeService: IncomesService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    this.selectedMonthYear = `${year}-${month.toString().padStart(2, '0')}`;
    this.showIncome();
    this.initializeIncomeChart();
    this.initializeIncomePieChartData();
  }

  openAddIncomeModal(): void {
    const dialogRef = this.dialog.open(AddIncomeModalComponent, {
      width: '400px',
      data: { mode: 'income' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newIncome = {
          source: result.source,
          amount: result.amount,
          date: result.date,
          description: result.category,
        };

        let obj ={
          "incomes": [
            {
              "source": result.source,
              "amount": result.amount,
              "date": result.date,
              "category": result.category
            }
          ]
        }


        this.api.addIncome(obj).subscribe({
          next: () => {
            this.snackBar.open('Income Added Successfully!', '', {
              duration: 1000,
              panelClass: ['snackbar-success'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.updateVisuals();
          },
          error: (err) => {
            const errorMessage = err.error?.message || 'Failed to add income';
            this.snackBar.open(errorMessage, '', {
              duration: 3000,
              panelClass: ['snackbar-error'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }

  showIncome(pageSize: number = 6) {
    const [year, month] = this.selectedMonthYear.split('-').map(Number);
    this.incomeService.getRecentIncomes(month, year, pageSize).subscribe({
      next: (res: any) => {
        this.recentIncome = res?.incomes || [];
        this.hasData = this.recentIncome.length > 0;
      },
      error: (err) => {
        this.recentIncome = [];
        this.hasData = false;
      },
    });
  }

  onDateChange(): void {
    this.showIncome();
  }

  editIncome(income: any): void {
    const dialogRef = this.dialog.open(AddIncomeModalComponent, {
      width: '400px',
      data: { ...income, mode: 'income' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedIncome = {
          id: income.id,
          source: result.source,
          amount: result.amount,
          date: result.date,
          category: result.category,
        };

        this.api.updateIncome(updatedIncome).subscribe({
          next: () => {
            this.snackBar.open('Income Updated Successfully!', '', {
              duration: 1000,
              panelClass: ['snackbar-success'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.updateVisuals();
          },
          error: (err) => {
            const errorMessage = err.error?.message || 'Failed to update income';
            this.snackBar.open(errorMessage, '', {
              duration: 3000,
              panelClass: ['snackbar-error'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }

  deleteIncome(income: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this income?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.api.deleteIncome(income).subscribe({
          next: () => {
            this.snackBar.open('Income Deleted Successfully!', '', {
              duration: 1000,
              panelClass: ['snackbar-success'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.updateVisuals();
          },
          error: (err) => {
            const errorMessage = err.error?.message || 'Failed to delete income';
            this.snackBar.open(errorMessage, '', {
              duration: 3000,
              panelClass: ['snackbar-error'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          },
        });
      }
    });
  }

  initializeIncomeChart() {
    this.incomeService.getLast12MonthsIncome().subscribe((income) => {
      const labels = income.map((inc) => inc.month);
      const data = income.map((inc) => inc.total);

      this.incomeChartData = {
        labels: labels,
        datasets: [
          {
            label: 'Income',
            backgroundColor: '#4CAF50',
            borderColor: '#4CAF50',
            data: data,
          },
        ],
      };
    });
  }

  initializeIncomePieChartData() {
    const selectedMonth = this.currentMonthIndex + 1;

    this.incomeService.getMonthlyCategoryBreakdown(selectedMonth, this.currentYear).subscribe((chartData) => {
      this.totalMonthlyIncome = chartData.totalAmount;
      this.incomePieChartData = {
        labels: chartData.labels,
        datasets: [
          {
            data: chartData.data,
          },
        ],
      };
    });
  }

  handleMonthChange(change: number) {
    this.currentMonthIndex += change;

    if (this.currentMonthIndex < 0) {
      this.currentMonthIndex = 11; // Wrap to December of the previous year
      this.currentYear--;
    } else if (this.currentMonthIndex > 11) {
      this.currentMonthIndex = 0; // Wrap to January of the next year
      this.currentYear++;
    }

    this.initializeIncomePieChartData();
  }

  toggleIncome() {
    this.showAll = !this.showAll; // Toggle the state
    const pageSize = this.showAll ? 1000 : 6; // Use 1000 for "See All" and 6 for "See Less"
    this.showIncome(pageSize); // Call the showIncome function with the appropriate page size
  }

  updateVisuals(){
    this.showIncome();
    this.initializeIncomeChart();
    this.initializeIncomePieChartData();
  }
}
