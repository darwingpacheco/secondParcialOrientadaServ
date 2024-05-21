import { Component, inject } from '@angular/core';
import { ConsultaService } from '../../services/http/consulta.service';
import { ProductosInterface } from '../../interfaces/productos-interface';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export default class ProductoComponent {

  private readonly productoS = inject(ConsultaService);

  constructor(
    private authService: ConsultaService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  producto: ProductosInterface[] = [];
  ngOnInit(){

  }

  logout(): void {
    console.log("presionaste cerrar sesion")
  this.authService.logout();
  this.router.navigate(['/login']);
  }

  
}
