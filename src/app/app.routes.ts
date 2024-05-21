import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import ProductoComponent from './pages/producto/producto.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'producto',
    component: ProductoComponent,
  },
  {
    path: '**',
    component: LoginComponent,
  },
];
