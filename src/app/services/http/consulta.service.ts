import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductosInterface } from '../../interfaces/productos-interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private authUrl = 'https://api.escuelajs.co/api/v1/auth';
  private apiUrl = 'https://api.escuelajs.co/api/v1/products';
  private apiUrlPost = 'https://api.escuelajs.co/api/v1/products/';
  private loggedIn = new BehaviorSubject<boolean>(false);
  private tokenExpirationTimeout: any;

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    const expiration = this.getTokenExpiration();
    if (token && expiration && new Date().getTime() < expiration) {
      this.loggedIn.next(true);
      const remainingTime = expiration - new Date().getTime();
      this.setTokenExpiration(remainingTime / 1000); // Convert ms to seconds
    }
  }

  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    console.log('Login Payload:', payload); // Log the payload

    return this.http.post<any>(`${this.authUrl}/login`, payload)
      .pipe(
        map(response => {
          console.log('API Response access token:', response.access_token); // Log the API response
          if (response && response.access_token) {
            const expirationTime = 1500 * 1000; // Expire in 6 seconds
            const expirationDate = new Date().getTime() + expirationTime;

            localStorage.setItem('token', response.access_token);
            localStorage.setItem('token_expiration', expirationDate.toString());

            this.setTokenExpiration(1500); // 25 min
            this.loggedIn.next(true);
          }
          return response;
        })
      );
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('Retrieved Token:', token); // Log the retrieved token
    return token;
  }

  getTokenExpiration(): number | null {
    const expiration = localStorage.getItem('token_expiration');
    return expiration ? parseInt(expiration, 10) : null;
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  logout(): void {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    localStorage.removeItem('token_expiration'); // Elimina la expiración del token del almacenamiento local
    if (this.tokenExpirationTimeout) {
      clearTimeout(this.tokenExpirationTimeout);
    }
    this.loggedIn.next(false); // Establece loggedIn como falso
    this.router.navigate(['login']); // Redirigir a la página de login
  }

  setTokenExpiration(expirationTimeInSeconds: number): void {
    console.log("ingreso en setTokenExpiration");
    this.tokenExpirationTimeout = setTimeout(() => {
      console.log("ingreso en logout");
      this.logout();
    }, expirationTimeInSeconds * 1000);
  }

  getAll(): Observable<ProductosInterface[]> {
    return this.http.get<ProductosInterface[]>(this.apiUrl);
  }

  create(product: ProductosInterface): Observable<ProductosInterface> {
    console.log(product);
    return this.http.post<ProductosInterface>(this.apiUrlPost, product);
  }

  update(product: ProductosInterface): Observable<ProductosInterface> {
    return this.http.put<ProductosInterface>(`${this.apiUrl}/${product.id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
