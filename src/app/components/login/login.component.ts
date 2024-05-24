import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultaService } from '../../services/http/consulta.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: ConsultaService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    const token = localStorage.getItem("token_auth");
    if(token){
      this.router.navigate(["producto"]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Verifique campos vacíos',
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        customClass: {
          container: 'my-swal-container',
          title: 'my-swal-title',
          icon: 'my-swal-icon',
          popup: 'my-swal-popup',
        },
      });
      return;
    }

    const { username, password } = this.loginForm.value;
    console.log('Form Submitted:', { username, password }); // Log form submission

    this.authService.login(username, password).subscribe(
      response => {
        localStorage.setItem('token_auth', response.token);
        localStorage.setItem('id_user', response.id);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Login exitoso',
          showConfirmButton: false,
          timer: 2500,
          toast: true,
          customClass: {
            container: 'my-swal-container',
            title: 'my-swal-title',
            icon: 'my-swal-icon',
          },
          background: '#E6F4EA',
        });
        this.router.navigate(["producto"]);
      },
      error => {
        console.error('Login failed', error); // Log the error
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: 'Las credenciales de acceso son incorrectas',
          showConfirmButton: false,
          timer: 1500,
          toast: true,
          customClass: {
            container: 'my-swal-container',
            title: 'my-swal-title',
            icon: 'my-swal-icon',
            popup: 'my-swal-popup',
          },
        });
      }
    );
  }
}
