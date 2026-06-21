import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http'; // 🌟 1. Importamos HttpErrorResponse
import { AuthService } from '../../../../core/services/auth.service';
import { LoginRequest } from '../../interfaces/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule], 
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    contrasenia: ['', [Validators.required]]
  });

  // Variables para el Modal de Recuperación
  mostrarModalRecuperacion = false;
  emailRecuperacion = new FormControl('', [Validators.required, Validators.email]);
  enviandoCorreo = false;

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credenciales: LoginRequest = this.loginForm.getRawValue();

      this.authService.login(credenciales).subscribe({
        next: (response) => {
          // 🌟 Ahora leemos el perfil directamente del servicio después del éxito
          const profile = this.authService.getUserProfile();
          const role = profile?.rol;

          if (role === 'ADMINISTRADOR') {
            this.router.navigate(['/admin/dashboard']);
          } else if (role === 'VETERINARIO') {
            this.router.navigate(['/veterinario/dashboard']);
          } else {
            this.router.navigate(['/cliente/dashboard']);
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log('Objeto completo del error:', err);
          
          const errorObj = err.error;

          const mensaje = (typeof errorObj?.data === 'string' ? errorObj.data : null) 
                          || errorObj?.mensaje 
                          || errorObj?.message 
                          || 'Error desconocido';
          
          alert(mensaje);
          this.enviandoCorreo = false;
        }
      });
    }
  }

  // Funciones del Modal de Recuperación
  abrirModalRecuperacion(event: Event) {
    event.preventDefault(); 
    this.mostrarModalRecuperacion = true;
    this.emailRecuperacion.reset();
  }

  cerrarModal() {
    this.mostrarModalRecuperacion = false;
  }

  enviarEnlaceRecuperacion() {
    if (this.emailRecuperacion.valid) {
      this.enviandoCorreo = true;
      this.authService.recuperarPassword(this.emailRecuperacion.value!).subscribe({
        next: (res: any) => {
          // Si el backend envía un mensaje de éxito ("Correo enviado..."), lo mostramos
          const mensajeExito = res.mensaje || 'Si el correo está registrado, recibirás un enlace pronto.';
          alert(mensajeExito);
          this.cerrarModal();
          this.enviandoCorreo = false;
        },
        error: (err: HttpErrorResponse) => { // 🌟 4. Tipamos el error
          console.error('Detalle del error:', err);
          // 🌟 5. Extraemos el mensaje (ej: "Email no encontrado en la base de datos")
          const mensajeError = err.error?.mensaje || 'Hubo un error al intentar enviar el correo.';
          alert(mensajeError);
          this.enviandoCorreo = false;
        }
      });
    } else {
      this.emailRecuperacion.markAsTouched();
    }
  }
}