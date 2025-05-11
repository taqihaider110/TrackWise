import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpensesService } from '../../services/expenses.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddExpenseModalComponent } from './add-expense-modal/add-expense-modal.component';
import { LineChartComponent } from '../../components/line-chart/line-chart.component';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { FormsModule } from '@angular/forms';
import { PieChartComponent } from "../../components/pie-chart/pie-chart.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { TotalCardComponent } from "../../components/total-card/total-card.component";

@Component({
  selector: 'app-expenses',
  imports: [
    HeaderComponent,
    SideBarComponent,
    BreadcrumbComponent,
    CommonModule,
    LineChartComponent,
    FormsModule,
    PieChartComponent,
    FooterComponent,
    TotalCardComponent
],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent {
  selectedMonthYear: string = '';
  recentExpenses: any[] = [];
  hasData: boolean = true;
  expenseChartData: any;

  currentMonthIndex: number = new Date().getMonth(); // Default to the current month
  currentYear: number = new Date().getFullYear(); // Default to the current year

  expensePieChartData: any; // For expenses
  totalMonthlyExpense: number=0;

  showAll: boolean = false;
  maxMonthYear: string = '';

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    private expenses: ExpensesService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    this.selectedMonthYear = `${year}-${month.toString().padStart(2, '0')}`;

    this.maxMonthYear = today.toISOString().slice(0, 7);

    this.showExpenses();
    this.initializeExpenseChart();
    this.intializeExpensePieChartData();
  }

  openAddExpenseModal(): void {
    const dialogRef = this.dialog.open(AddExpenseModalComponent, {
      autoFocus: false, 
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const newExpense = {
          category: result.category,
          amount: result.amount,
          date: result.date,
          description: result.description,
        };

        this.api.addExpense({ expense: [newExpense] }).subscribe({
          next: () => {
            this.snackBar.open('Expense Added Successfully!', '', {
              duration: 1000,
              panelClass: ['snackbar-success'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.updateVisuals();
          },
          error: (err) => {
            const errorMessage = err.error?.message || 'Failed to add expense';
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

  showExpenses(pageSize: number = 6) {
    const [year, month] = this.selectedMonthYear.split('-').map(Number);
    this.expenses.getRecentExpenses(month, year, pageSize).subscribe({
      next: (res: any) => {
        this.recentExpenses = res?.expenses || [];
        this.hasData = this.recentExpenses.length > 0;
      },
      error: () => {
        this.recentExpenses = [];
        this.hasData = false;
      },
    });
  }

  onDateChange(): void {
    this.showExpenses();
  }

  editExpense(expense: any): void {
    const dialogRef = this.dialog.open(AddExpenseModalComponent, {
      width: '400px',
      data: { ...expense }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedExpense = {
          id: expense.id,
          category: result.category,
          amount: result.amount,
          date: result.date,
          description: result.description,
        };

        this.api.updateExpense(updatedExpense).subscribe({
          next: () => {
            this.snackBar.open('Expense Updated Successfully!', '', {
              duration: 1000,
              panelClass: ['snackbar-success'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.updateVisuals();
          },
          error: (err) => {
            const errorMessage = err.error?.message || 'Failed to update expense';
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

  deleteExpense(expense: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this expense?',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.api.deleteExpense(expense).subscribe({
          next: () => {
            this.snackBar.open('Expense Deleted Successfully!', '', {
              duration: 1000,
              panelClass: ['snackbar-success'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.updateVisuals();
          },
          error: (err) => {
            const errorMessage = err.error?.message || 'Failed to delete expense';
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

  initializeExpenseChart() {
    this.expenses.getLast12MonthsExpenses().subscribe((expenses) => {
      const labels = expenses.map(expense => expense.month);
      const data = expenses.map(expense => expense.total);

      this.expenseChartData = {
        labels: labels,
        datasets: [
          {
            label: 'Expenses',
            backgroundColor: '#FF6384',
            borderColor: '#FF6384',
            data: data
          }
        ]
      };
    });
  }


  intializeExpensePieChartData() {
    const selectedMonth = this.currentMonthIndex + 1;

    this.expenses.getMonthlyCategoryBreakdown(selectedMonth, this.currentYear).subscribe((chartData) => {

      this.totalMonthlyExpense = chartData.totalAmount;
      this.expensePieChartData = {
        labels: chartData.labels,
        datasets: [
          {
            data: chartData.data
          }
        ]
      };
    });
  }

  handleMonthChange(change: number){
    this.currentMonthIndex += change;

    if (this.currentMonthIndex < 0) {
      this.currentMonthIndex = 11; // Wrap to December of the previous year
      this.currentYear--;
    } else if (this.currentMonthIndex > 11) {
      this.currentMonthIndex = 0; // Wrap to January of the next year
      this.currentYear++;
    }

    this.intializeExpensePieChartData();
  }

  toggleExpenses() {
    this.showAll = !this.showAll; // Toggle the state
    const pageSize = this.showAll ? 1000 : 6; // Use 1000 for "See All" and 6 for "See Less"
    this.showExpenses(pageSize); // Call the showExpenses function with the appropriate page size
  }

  updateVisuals(){
    this.showExpenses();
    this.initializeExpenseChart();
    this.intializeExpensePieChartData();
  }
}
