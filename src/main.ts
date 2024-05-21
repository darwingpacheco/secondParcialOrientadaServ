import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './app/components/login/login.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ConsultaService } from './app/services/http/consulta.service';
import { TokenInterceptor } from './app/interceptors/token.interceptor';

import ProductoComponent from './app/pages/producto/producto.component';
import { authGuard } from './app/services/http/auth.guard';



bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'producto', component: ProductoComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule, ReactiveFormsModule),
    ConsultaService,
  
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ]
}).catch(err => console.error(err));
