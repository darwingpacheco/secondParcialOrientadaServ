// src/app/services/http/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ConsultaService } from './consulta.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private consultaService: ConsultaService, private router: Router) {}

  canActivate(): boolean {
    const token = this.consultaService.getToken();
    if (token) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
