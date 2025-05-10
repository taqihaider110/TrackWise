import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard'; // Import your AuthGuard

const routes: Routes = [
    { path: '', loadChildren: () => import('./splash/splash.module').then(m => m.SplashModule) },
    {
      path: 'auth',
      loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    },
    {
      path: 'home',
      loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    },
    {
      path: 'dashboard',
      loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
      canActivate: [authGuard], // Protect this route
    },
    {
      path: 'expenses',
      loadChildren: () => import('./expenses/expenses.module').then(m => m.ExpensesModule),
      canActivate: [authGuard], // Protect this route
    },
    {
      path: 'income',
      loadChildren: () => import('./income/income.module').then(m => m.IncomeModule),
      canActivate: [authGuard], // Protect this route
    },
    {
      path: 'profile',
      loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      canActivate: [authGuard], // Protect this route
    },
    {
      path: 'about-us',
      loadChildren: () => import('./about-us/about-us.module').then(m => m.AboutUsModule),
    },
    {
      path: 'contact-us',
      loadChildren: () => import('./contact-us/contact-us.module').then(m => m.ContactUsModule),
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
