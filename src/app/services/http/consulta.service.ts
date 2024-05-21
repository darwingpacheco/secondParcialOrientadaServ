import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductosInterface } from '../../interfaces/productos-interface';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  private readonly _http = inject(HttpClient);
  private authUrl = 'https://api.escuelajs.co/api/v1/auth';
  private apiUrl = 'https://api.escuelajs.co/api/v1/products';
  private apiUrlPost = 'https://api.escuelajs.co/api/v1/products/';
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    console.log('Login Payload:', payload); // Log the payload

    return this.http.post<any>(`${this.authUrl}/login`, payload)
      .pipe(
        map(response => {
          console.log('API Response:', response); // Log the API response
          if (response && response.token) {
            console.log('API Response:', response); // Log the API response
            console.log('API Response:', response.token); // Log the API response
            localStorage.setItem('token', response.token);
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

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  logout(): void {
    localStorage.removeItem('token_auth'); // Elimina el token del almacenamiento local
    this.loggedIn.next(false); // Establece loggedIn como falso
  }

  getAll(): Observable<ProductosInterface[]> {
    return this._http.get<ProductosInterface[]>(this.apiUrl);
  }

  create(product: ProductosInterface): Observable<ProductosInterface> {
    console.log(product)
    return this._http.post<ProductosInterface>(this.apiUrlPost, product);
  }

  update(product: ProductosInterface): Observable<ProductosInterface> {
    return this._http.put<ProductosInterface>(`${this.apiUrl}/${product.id}`, product);
  }

  delete(id: number): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
