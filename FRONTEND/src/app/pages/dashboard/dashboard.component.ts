import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { CommonModule } from '@angular/common';
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { ChartModule } from 'primeng/chart';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ExpensesService } from '../../services/expenses.service';
// import { PieChartExpenseComponent } from "../../components/pie-chart-expense/pie-chart-expense.component";
import { IncomesService } from '../../services/incomes.service';
import { LineChartComponent } from "../../components/line-chart/line-chart.component";
import { PieChartComponent } from "../../components/pie-chart/pie-chart.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { SavingsService } from '../../services/savings.service';
import { TotalCardComponent } from "../../components/total-card/total-card.component";

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, BreadcrumbComponent, CommonModule, SideBarComponent, ChartModule, RouterModule, LineChartComponent, PieChartComponent, FooterComponent, TotalCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  currentMonthIndex: number = new Date().getMonth(); // Default to the current month
  currentYear: number = new Date().getFullYear(); // Default to the current year

  expenseChartData: any;
  incomeChartData: any;
  savingsChartData: any;

  expensePieChartData: any; // For expenses
  incomePieChartData: any;

  months: string[] = ['January', 'February', 'March', 'April'];

totalMonthlySavings: number=0;

  constructor(private api: ApiService, private expenses:ExpensesService, private income: IncomesService, private savings: SavingsService) {}

   ngOnInit() {
    this.intializeExpenseChart();
    this.initializeIncomeChart();
    this.intializeSavingsChart();

    this.intializeExpensePieChartData();
    this.intializeIncomePieChartData();

    this.getTotalMonthlySavings();
  }

   intializeExpenseChart(){
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

   initializeIncomeChart() {
    this.income.getLast12MonthsIncome().subscribe((income) => {
      // console.log(income);
      const labels = income.map(income => income.month);
      const data = income.map(income=> income.total);

      this.incomeChartData = {
        labels: labels,
        datasets: [
          {
            label: 'Income',
            backgroundColor: '#4CAF50',
            borderColor: '#4CAF50',
            data: data
          }
        ]
      };
    });
  }

  intializeSavingsChart(){
    this.savings.getLast12MonthsSavings().subscribe((savings) => {
      console.log(savings);
      const labels = savings.map(saving => saving.month);
      const data = savings.map(saving => saving.total);

      this.savingsChartData = {
        labels: labels,
        datasets: [
          {
            label: 'Savings',
            backgroundColor: '#42A5F5',
            borderColor: '#42A5F5',
            data: data
          }
        ]
      };
    });
   }

  intializeExpensePieChartData() {
    const selectedMonth = this.currentMonthIndex + 1; // Convert 0-based index to 1-based month
    this.expenses.getMonthlyCategoryBreakdown(selectedMonth, this.currentYear).subscribe((chartData) => {
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

  intializeIncomePieChartData(){
    const selectedMonth = this.currentMonthIndex + 1; // Convert 0-based index to 1-based month
    this.income.getMonthlyCategoryBreakdown(selectedMonth, this.currentYear).subscribe((chartData) => {
      this.incomePieChartData = {
        labels: chartData.labels,
        datasets: [
          {
            data: chartData.data
          }
        ]
      };
    });
  }

  getTotalMonthlySavings() {
    const selectedMonth = this.currentMonthIndex + 1; // Convert 0-based index to 1-based month
    this.savings.getMonthlyTotal(selectedMonth, this.currentYear).subscribe((chartData) => {
      this.totalMonthlySavings = chartData.totalAmount;
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
    this.intializeIncomePieChartData();

    this.getTotalMonthlySavings();
  }

}

