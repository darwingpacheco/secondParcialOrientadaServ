import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConsultaService } from '../../services/http/consulta.service';
import { ProductosInterface } from '../../interfaces/productos-interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export default class ProductoComponent implements OnInit {
  private readonly productoS = inject(ConsultaService);
  producto: ProductosInterface[] = [];
  selectedProduct: ProductosInterface = {
    id_producto: 0,
    nombre: '',
    detalle: '',
    valor: 0,
    images: [''],
  };

  constructor(
    private authService: ConsultaService,
    private router: Router,
    private fb: FormBuilder
  ) {}
  
  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productoS.getAll().subscribe(
      (res: any) => {
        console.log('Response from getAll:', res); // Log the response from the backend
        if (res.data && Array.isArray(res.data.data)) {
          this.producto = res.data.data.map((product: ProductosInterface) => ({
            ...product,
            images: this.parseImages(product.images) // Asegúrate de que images esté definido y en el formato correcto
          }));
        } else {
          console.error('Unexpected response format:', res); // Log unexpected format
        }
      },
      (error) => {
        console.error('Error fetching products:', error); // Log any error
      }
    );
  }

  parseImages(images: any): string[] {
    if (Array.isArray(images)) {
      return images.map(this.cleanImageUrl);
    } else if (typeof images === 'string') {
      return [this.cleanImageUrl(images)];
    } else {
      return [];
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  addProduct() {
    console.log("se presiono add");
    this.selectedProduct = {  
      id_producto: 0, 
      nombre: '', 
      detalle: '', 
      valor: 0,
      images: [''], 
    };
  }

  editProduct(id: number) {
    const product = this.producto.find(item => item.id_producto === id);
    if (product) {
      this.selectedProduct = { ...product, images: [...product.images] };
    }
  }

  deleteProduct(id: number) {
    this.productoS.delete(id).subscribe(() => {
      this.loadProducts();

      // Eliminar el producto del array local
      this.producto = this.producto.filter(item => item.id_producto !== id);
      
      // Mostrar mensaje de éxito con SweetAlert2
      Swal.fire({
        icon: 'success',
        title: '¡Producto eliminado!',
        text: 'El producto se eliminó correctamente.'
      });
    }, error => {
      // Mostrar mensaje de error con SweetAlert2
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el producto. Inténtalo de nuevo.'
      });
    });
  }

  saveProduct() {
    if (this.selectedProduct) {
      // Clean the image URLs before saving
      this.selectedProduct.images = this.selectedProduct.images.map(this.cleanImageUrl);
  
      if (this.selectedProduct.id_producto) {
        this.productoS.update(this.selectedProduct).subscribe(() => {
          this.loadProducts();
          Swal.fire({
            icon: 'success',
            title: '¡Producto actualizado!',
            text: 'El producto se actualizó correctamente.'
          });
          this.resetSelectedProduct();
          this.closeModal();
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el producto. Inténtalo de nuevo.'
          });
        });
      } else {
        this.productoS.create(this.selectedProduct).subscribe(() => {
          this.loadProducts();
          Swal.fire({
            icon: 'success',
            title: '¡Producto creado!',
            text: 'El producto se creó correctamente.'
          });
          this.resetSelectedProduct();
          this.closeModal();
        }, error => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear el producto. Inténtalo de nuevo.'
          });
        });
      }
    }
  }

  resetSelectedProduct() {
    this.selectedProduct = {
      id_producto: 0,
      nombre: '',
      detalle: '',
      valor: 0,
      images: [''],
    };
  }

  cleanImageUrl(url: string): string {
    url = url.replace(/^\[?"|"?\]$/g, '');
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    return url;
  }

  closeModal() {
    // Implementa aquí la lógica para cerrar el modal
    // Puedes usar jQuery o funciones proporcionadas por el framework que estés utilizando para cerrar el modal
    // Por ejemplo:
    // $('#editProductModal').modal('hide');
    // Otra opción podría ser manejar la visibilidad del modal en Angular mediante una propiedad booleana en tu componente
  }

}
