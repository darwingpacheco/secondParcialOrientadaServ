import { Component, OnInit, inject } from '@angular/core';
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
    id: 0,
    title: '',
    description: '',
    price: 0,
    images: [''],
    categoryId: 4
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
    this.productoS.getAll().subscribe((res: ProductosInterface[]) => {
      this.producto = res.map(product => ({
        ...product,
        images: product.images.map(this.cleanImageUrl)
      }));
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login'])
  }

  addProduct() {
    console.log("se presiono add")
    this.selectedProduct = { title: '', description: '', price: 0, images: [''], categoryId: 4 };
  }

  editProduct(id: number) {
    const product = this.producto.find(item => item.id === id);
    if (product) {
      this.selectedProduct = { ...product, images: [...product.images] };
    }
  }

  deleteProduct(id: number) {
    this.productoS.delete(id).subscribe(() => {
      this.loadProducts();
  
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

  updateProduct(updatedProduct: ProductosInterface) {
    this.productoS.update(updatedProduct).subscribe(() => {
      this.loadProducts(); // Recargar la lista de productos después de actualizar uno
    });
  }

  saveProduct() {
    if (this.selectedProduct) {
      // Clean the image URLs before saving
      this.selectedProduct.images = this.selectedProduct.images.map(this.cleanImageUrl);

      if (this.selectedProduct.id) {
        this.productoS.update(this.selectedProduct).subscribe(() => {
          this.loadProducts();
        });
      } else {
        this.productoS.create(this.selectedProduct).subscribe(() => {
          this.loadProducts();
          this.closeModal(); // Cierra el modal después de crear un nuevo producto
        });
      }
    }
  }

  cleanImageUrl(url: string): string {
    return url.replace(/^\[?"|"?\]$/g, '');
  }

  removeImage(index: number) {
    if (this.selectedProduct) {
      this.selectedProduct.images.splice(index, 1);
    }
  }

  closeModal() {
    // Implementa aquí la lógica para cerrar el modal
    // Puedes usar jQuery o funciones proporcionadas por el framework que estés utilizando para cerrar el modal
    // Por ejemplo:
    // $('#editProductModal').modal('hide');
    // Otra opción podría ser manejar la visibilidad del modal en Angular mediante una propiedad booleana en tu componente
  }

}
