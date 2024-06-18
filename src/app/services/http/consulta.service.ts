import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductosInterface } from '../../interfaces/productos-interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private readonly _http = inject(HttpClient);
  private authUrl = 'http://localhost:8000/auth'; // Cambia esto a tu backend en Express
  private apiUrl = 'http://localhost:8000/producto'; // Cambia esto a tu backend en Express
  private apiUrlGetAllProducts = 'http://localhost:8000/producto/all'; // Cambia esto a tu backend en Express
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

  login(username: string, password: string): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);
    console.log('Login Params:', params.toString()); // Log the params

    return this.http.get<any>(`${this.authUrl}`, { params })
      .pipe(
        map(response => {
          console.log('API Response:', response); // Log the full API response
          if (response) {
            console.log('Entro en response de login', response); // Log the response details
            const expirationTime = 1500 * 1000; // Expire in 25 minutes
            const expirationDate = new Date().getTime() + expirationTime;

            localStorage.setItem('token', response.token);
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

  getAll(): Observable<any> { // Note: Changed the return type to any
    console.log("Fetching all products from", this.apiUrlGetAllProducts);
    return this.http.get<any>(this.apiUrlGetAllProducts).pipe(
      map(response => {
        console.log("Response from database:", response); // Log the response from the database
        return response; // Ensure this is the full response object
      })
    );
  }

  create(product: ProductosInterface): Observable<ProductosInterface> {
    console.log(product);
    return this._http.post<ProductosInterface>(this.apiUrl, product);
  }

  update(product: ProductosInterface): Observable<ProductosInterface> {
    return this._http.put<ProductosInterface>(`${this.apiUrl}/${product.id_producto}`, product);
  }

  delete(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
