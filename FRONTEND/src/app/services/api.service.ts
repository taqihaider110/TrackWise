import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface LandingInfo {
  message: string;
  features: string[];
  about: string;
  contact: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private client: HttpClient) { }

  // Countries APIs
  getCountries() {
    return this.client.get('https://countriesnow.space/api/v0.1/countries/positions');
  }

  getStates(country: string) {
    return this.client.post('https://countriesnow.space/api/v0.1/countries/states', {
      country: country
    });
  }

  getCities(country: string, state: string) {
    return this.client.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
      country: country,
      state: state
    });
  }



  // APIs from backend

  // getLandingInfo() {
  //   return this.client.get('https://ai-finance-tracker-ko8v.onrender.com/api/v1/landing')
  // }

  //Auth APIs
  loginUserApi(obj: any) {
    return this.client.post('https://ai-finance-tracker-ko8v.onrender.com/api/v1/auth/login', obj)
  }

  signUpUserApi(obj: any) {
    return this.client.post('https://ai-finance-tracker-ko8v.onrender.com/api/v1/auth/signup', obj)
  }

  //////
  getDashboardData() {
    const token = localStorage.getItem('token');

    return this.client.get('https://ai-finance-tracker-ko8v.onrender.com/api/v1/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  addExpense(obj: any){
    const token = localStorage.getItem('token');

    return this.client.post('https://ai-finance-tracker-ko8v.onrender.com/api/v1/expenses', obj, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  //api to update expense
  updateExpense(expense: any): Observable<any>{
    const token = localStorage.getItem('token');

    return this.client.put(`https://ai-finance-tracker-ko8v.onrender.com/api/v1/expenses/${expense.id}`, expense, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  //api to delete expense
  deleteExpense(expense: any): Observable<any>{
    const token = localStorage.getItem('token');
    console.log('Deleting expense:', expense.id); // Log the expense being deleted
    return this.client.delete(`https://ai-finance-tracker-ko8v.onrender.com/api/v1/expenses/${expense.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  // getMonthlyExpensesSummary(month: number, year: number): Observable<any[]> {
  //   const token = localStorage.getItem('token');

  //   const url = `https://ai-finance-tracker-ko8v.onrender.com/api/v1/expenses/monthly-summary?month=${month}&year=${year}`;

  //   return this.client.get<any[]>(url, {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   });
  // }

  getExpensesSummary(year: number) {
    const token = localStorage.getItem('token');

    const url = `https://ai-finance-tracker-ko8v.onrender.com/api/v1/expenses?year=${year}`;

    return this.client.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  //calls api for expenses of last 12 motths
  getLast12MonthsExpenses() {
    const token = localStorage.getItem('token');

    const url = 'https://ai-finance-tracker-ko8v.onrender.com/api/v1/expenses/past-12-months';

    return this.client.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  //api tp get monthly expense summary with category breakdown
  getMonthlyExpenseSummaryWithCategory(month: number, year: number) {
    const token = localStorage.getItem('token');

    const url = `https://ai-finance-tracker-ko8v.onrender.com/api/v1/expenses/monthly-summary?month=${month}&year=${year}`;

    return this.client.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  //Api to get recent expenses
  getRecentExpenses(month: number, year: number, pageSize: number = 6) {
    const token = localStorage.getItem('token');

    const url = `https://ai-finance-tracker-ko8v.onrender.com/api/v1/expenses?month=${month}&year=${year}&page=1&pageSize=${pageSize}`;

    return this.client.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }


  //////// INCOME APIS
  getLast12MonthsIncome() {
    const token = localStorage.getItem('token');

    const url = 'https://ai-finance-tracker-ko8v.onrender.com/api/v1/incomes/past-12-months';

    return this.client.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

   //api tp get monthly expense summary with category breakdown
   getMonthlyIncomeSummaryWithCategory(month: number, year: number) {
    const token = localStorage.getItem('token');

    const url = `https://ai-finance-tracker-ko8v.onrender.com/api/v1/incomes/monthly-summary?month=${month}&year=${year}`;

    return this.client.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  addIncome(obj: any) {
    console.log("Adding income:", obj); // Log the income being added
    const token = localStorage.getItem('token');

    return this.client.post('https://ai-finance-tracker-ko8v.onrender.com/api/v1/incomes', obj, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  updateIncome(income: any): Observable<any> {
    const token = localStorage.getItem('token');

    return this.client.put(`https://ai-finance-tracker-ko8v.onrender.com/api/v1/incomes/${income.id}`, income, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  deleteIncome(income: any): Observable<any> {
    const token = localStorage.getItem('token');

    return this.client.delete(`https://ai-finance-tracker-ko8v.onrender.com/api/v1/incomes/${income.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getRecentIncomes(month: number, year: number, pageSize: number = 6) {
    const token = localStorage.getItem('token');

    const url = `https://ai-finance-tracker-ko8v.onrender.com/api/v1/incomes?month=${month}&year=${year}&page=1&pageSize=${pageSize}`;

    return this.client.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }


  /////// apis for profile
  getProfile() {
    const token = localStorage.getItem('token');

    return this.client.get('https://ai-finance-tracker-ko8v.onrender.com/api/v1/profile/info-details', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  postProfile(obj: any) {
    const token = localStorage.getItem('token');

    return this.client.post('https://ai-finance-tracker-ko8v.onrender.com/api/v1/profile/info-details', obj, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getProfileAddress() {
    const token = localStorage.getItem('token');

    return this.client.get('https://ai-finance-tracker-ko8v.onrender.com/api/v1/profile/address', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  postProfileAddress(obj: any) {
    const token = localStorage.getItem('token');

    return this.client.put('https://ai-finance-tracker-ko8v.onrender.com/api/v1/profile/address', obj, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

}
