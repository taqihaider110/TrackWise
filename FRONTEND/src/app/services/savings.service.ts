import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SavingsService {

  constructor(private api: ApiService) {}

   getLast12MonthsSavings(): Observable<{ month: string, total: number }[]> {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      return this.api.getLast12MonthsSavings().pipe(
        map((res: any) => {
          // console.log('API Response:', res); // Log the API response
          return res.savingsProgress
            .map((item: { month: string; savings: number }) => ({
              month: monthNames[parseInt(item.month.split('-')[1], 10) - 1], // Convert numeric month to name
              total: item.savings
            }))
            .reverse(); // Reverse the order of the array
        })
      );
    }

    getMonthlyTotal(month: number, year: number): Observable<{ totalAmount: number }> {
    return this.api.getMonthlySavings(month, year).pipe(
      map((res: any) => {
        console.log('API Response:', res);
        const items = res.categoryBreakdown ?? []; // Handle cases where categoryBreakdown is null or undefined
        const totalAmount = res.savings;

        return { totalAmount };
      })
    );
  }


}
