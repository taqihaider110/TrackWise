import { Routes } from '@angular/router';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { LoginComponent } from './pages/auth/login/login.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  // {
  //   path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
  // },
  // {
  //   path: 'signup',
  //   component: SignupComponent
  // }
];
