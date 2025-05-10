import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class IncomesService {
  month: any;

  constructor(private api: ApiService) { }

  // returns the income of last 12 months for graph
  getLast12MonthsIncome(): Observable<{ month: number, total: number }[]> {
    return this.api.getLast12MonthsIncome().pipe(
      map((res: any) =>
        res
          .map((item: { month: number; totalAmount: number }) => ({
            month: item.month,
            total: item.totalAmount
          }))
          .reverse() // Reverse the order of the array
      )
    );
  }

  // returns the income of a month with category breakdown for pie chart
  getMonthlyCategoryBreakdown(month: number, year: number): Observable<{ labels: string[], data: number[], totalAmount: number }> {
    return this.api.getMonthlyIncomeSummaryWithCategory(month, year).pipe(
      map((res: any) => {
        const items = res.categoryBreakdown ?? []; // Handle cases where categoryBreakdown is null or undefined
        const totalAmount = res.totalIncome;
        // Extract labels (categories) and data (totals)
        const labels = items.map((item: { category: string }) => item.category);
        const data = items.map((item: { totalAmount: number }) => item.totalAmount);

        return { labels, data, totalAmount };
      })
    );
  }

  getRecentIncomes(month: number, year: number, pageSize: number): Observable<any> {
      return this.api.getRecentIncomes(month, year, pageSize).pipe(
        catchError((error) => {
          console.error('API Error:', error);
          return of(null); // Return a fallback value in case of error
        })
      );
    }

}
