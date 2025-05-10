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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, BreadcrumbComponent, CommonModule, SideBarComponent, ChartModule, RouterModule, LineChartComponent, PieChartComponent],
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

  expensePieChartData: any; // For expenses
  incomePieChartData: any;

  //////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////
  chartData: any;
  chartOptions: any;

  pieChartData: any;
  pieChartOptions: any;

  months: string[] = ['January', 'February', 'March', 'April'];
  // currentMonthIndex: number = 2; // Default to March

  constructor(private api: ApiService, private expenses:ExpensesService, private income: IncomesService) {}

   ngOnInit() {
    // this.initializeChartOptions();
    // this.initializeBarChart();

    // this.updatePieChartData();

    // this.api.getDashboardData().subscribe((res: any) => {
    //   console.log(res)
    // });

    // this.api.getMonthlyExpensesSummary(1, 2025).subscribe(response => {
    //   console.log('1month data',response);
    // });

    // this.api.getExpensesSummary(2025).subscribe(response2 => {
    //   console.log(response2);
    // });

    // this.expenses.getAllMonthlyExpenses().subscribe((expenses) => {
    //   console.log(expenses);
    // });



    ///////////////////////////////////////////////////////////////////////////////////
    this.intializeExpenseChart();
    this.initializeIncomeChart();

    this.intializeExpensePieChartData();
    this.intializeIncomePieChartData();
  }

  // get currentMonth(): string {
  //   return this.months[this.currentMonthIndex];
  // }

  // goToPreviousMonth(): void {
  //   if (this.currentMonthIndex > 0) {
  //     this.currentMonthIndex--;
  //     this.updatePieChartData();
  //   }
  // }

  // goToNextMonth(): void {
  //   if (this.currentMonthIndex < this.months.length - 1) {
  //     this.currentMonthIndex++;
  //     this.updatePieChartData();
  //   }
  // }

  // updatePieChartData(): void {
  //   const mockData: { [key: string]: number[] } = {
  //     January: [100, 200, 300],
  //     February: [400, 100, 250],
  //     March: [300, 500, 200],
  //     April: [200, 400, 350]
  //   };

  //   this.pieChartData = {
  //     labels: ['Development', 'Marketing', 'Sales'],
  //     datasets: [
  //       {
  //         data: mockData[this.currentMonth] || [0, 0, 0],
  //         backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
  //         hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D']
  //       }
  //     ]
  //   };
  // }

  // initializeChartOptions(): void {
  //   this.chartOptions = {
  //     maintainAspectRatio: false,
  //     aspectRatio: 1.2,
  //     responsive: true,
  //     plugins: {
  //       legend: {
  //         display: false,
  //         labels: {
  //           color: '#fff'
  //         }
  //       }
  //     },
  //     scales: {
  //       x: {
  //         ticks: { color: '#fff' },
  //         grid: { color: '#fff' },
  //         title: {
  //           display: true,
  //           text: 'Months',
  //           color: '#fff',
  //           font: {
  //             family: 'Poppins',
  //             size: 20,
  //             weight: 'bold'
  //           }
  //         }
  //       },
  //       y: {
  //         ticks: { color: '#fff' },
  //         grid: { color: '#fff' },
  //         title: {
  //           display: true,
  //           color: '#fff',
  //           font: {
  //             family: 'Poppins',
  //             size: 20,
  //             weight: 'bold'
  //           }
  //         }
  //       }
  //     }
  //   };

  //   this.pieChartOptions = {
  //     maintainAspectRatio: false,
  //     aspectRatio: 1.2,
  //     responsive: true,
  //     plugins: {
  //       legend: {
  //         position: 'bottom',
  //         labels: {
  //           color: '#fff'
  //         }
  //       }
  //     }
  //   };
  // }

  // initializeBarChart(): void {
  //   this.chartData = {
  //     labels: ['January', 'February', 'March', 'April'],
  //     datasets: [
  //       {
  //         label: 'Income',
  //         backgroundColor: '#02EA77',
  //         borderColor: '#02EA77',
  //         data: [65, 59, 80, 81, 100]
  //       }
  //     ]
  //   };
  // }


    /////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////
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
  }

}

