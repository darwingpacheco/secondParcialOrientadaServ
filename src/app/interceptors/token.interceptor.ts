import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConsultaService } from '../services/http/consulta.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: ConsultaService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (localStorage.getItem('token_auth')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem("token_auth")}`!
        }
      });
    }
    return next.handle(request);
  }
}
