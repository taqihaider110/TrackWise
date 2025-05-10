import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError, last, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  monthlyExpenses: { month: number; total: number }[] = [];

  constructor(private api: ApiService) { }

  // getCategorySummary(
  //   month: number,
  //   year: number
  // ): Observable<{ labels: string[]; totals: number[] }> {
  //   return this.api.getMonthlyExpensesSummary(month, year).pipe(
  //     map((res: any) => {
  //       const items = res.categoryBreakdown ?? [];

  //       const labels = items.map((item: { category: any }) => item.category);
  //       const totals = items.map(
  //         (item: { totalAmount: any }) => item.totalAmount
  //       );

  //       return { labels, totals };
  //     })
  //   );
  // }

 // returns the expense of a month with category breakdown for pie chart
  getMonthlyCategoryBreakdown(month: number, year: number): Observable<{ labels: string[], data: number[], totalAmount: number}> {
    return this.api.getMonthlyExpenseSummaryWithCategory(month, year).pipe(
      map((res: any) => {
        const items = res.categoryBreakdown ?? []; // Ensure we handle cases where categoryBreakdown is null or undefined
        const totalAmount = res.totalExpenses;
        // console.log(totalAmount)
        // Extract labels (categories) and data (totals)
        const labels = items.map((item: { category: string }) => item.category);
        const data = items.map((item: { totalAmount: number }) => item.totalAmount);

        return { labels, data, totalAmount };
      })
    );
  }

  // returns the expense of alst 12 months for graph
  getLast12MonthsExpenses(): Observable<{ month: number; total: number }[]> {
    return this.api.getLast12MonthsExpenses().pipe(
      map((res: any) =>
        res
          .map((item: { month: number; totalAmount: number }) => ({
            month: item.month,
            total: item.totalAmount,
          }))
          .reverse() 
      )
    );
  }

  // returns recent expenses of the month
  getRecentExpenses(month: number, year: number, pageSize: number): Observable<any> {
    return this.api.getRecentExpenses(month, year, pageSize).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return of(null); // Return a fallback value in case of error
      })
    );
  }




  // getAllMonthlyExpenses(): Observable<{ month: number, total: number }[]> {
  //   const currentYear = new Date().getFullYear();
  //   const requests = [];

  //   for (let month = 1; month <= 12; month++) {
  //     const request = this.api.getMonthlyExpensesSummary(month, currentYear).pipe(
  //       map((res: any) => ({ month, total: res?.totalExpenses ?? 0 })),
  //       catchError(() => of({ month, total: 0 }))
  //     );
  //     requests.push(request);
  //   }

  //   return forkJoin(requests).pipe(
  //     map(results => results.sort((a, b) => a.month - b.month)) // sort by month
  //   );
  // }
}
