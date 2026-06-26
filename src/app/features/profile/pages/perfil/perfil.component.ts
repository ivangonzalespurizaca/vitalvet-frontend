import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, CustomJwtPayload } from '../../../../core/services/auth.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { MediaService } from '../../../../core/services/media.service';
import { PerfilRequest } from '../../../../core/interfaces/perfil-request';
import Swal from 'sweetalert2';
// Ajusta la ruta de tus servicios e interfaces según la estructura de tu proyecto

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private mediaService = inject(MediaService);

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  usuario: CustomJwtPayload | null = null;
  perfilForm!: FormGroup;
  
  esVeterinario = false;
  cargando = false;

  fotoUrlActual: string | null = null;
  archivoSeleccionado: File | null = null;
  fotoPreviewUrl: string | ArrayBuffer | null = null;

  ngOnInit(): void {
    this.usuario = this.authService.getUserProfile();
    this.esVeterinario = this.usuario?.rol === 'VETERINARIO';
    this.fotoUrlActual = this.usuario?.fotoUrl || null;
    this.inicializarFormulario();
  }

  private inicializarFormulario(): void {
    // Solo permitimos editar Nombres, Apellidos y Celular según tu PerfilRequest
    this.perfilForm = this.fb.group({
      // Campos No Editables (Solo lectura para visualización)
      rol: [{ value: this.usuario?.rol || '', disabled: true }],
      email: [{ value: this.usuario?.sub || '', disabled: true }], // Asumiendo que 'sub' es el email en el JWT
      dni: [{ value: this.usuario?.dni, disabled: true }], // Reemplaza con datos reales si los tienes en el token o servicio

      // Campos Editables
      nombres: [this.usuario?.nombres || '', [Validators.required, Validators.maxLength(100)]],
      apellidos: [this.usuario?.apellidos || '', [Validators.required, Validators.maxLength(100)]],
      celular: [this.usuario?.celular, [Validators.maxLength(15)]] // Pon el valor inicial real aquí
    });
  }

  onArchivoSeleccionado(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      
      const reader = new FileReader();
      reader.onload = e => this.fotoPreviewUrl = reader.result;
      reader.readAsDataURL(file);
    }
  }

  get iniciales(): string {
    if (!this.usuario) return '';
    return `${this.usuario.nombres[0]}${this.usuario.apellidos[0]}`.toUpperCase();
  }

  async guardarCambios(): Promise<void> {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    let urlFotoFinal = this.fotoUrlActual;

    try {
      if (this.archivoSeleccionado) {
        const respMedia = await this.mediaService.subirFoto(this.archivoSeleccionado).toPromise();
        if (respMedia?.success && respMedia.data?.urlFoto) {
           urlFotoFinal = respMedia.data.urlFoto;
        } else {
           this.toast.fire({ icon: 'error', title: 'Problema al subir la imagen.' });
           this.cargando = false;
           return;
        }
      }

      const request: PerfilRequest = {
        nombres: this.perfilForm.get('nombres')?.value,
        apellidos: this.perfilForm.get('apellidos')?.value,
        celular: this.perfilForm.get('celular')?.value,
        fotoUrl: urlFotoFinal || undefined
      };

      this.usuarioService.actualizarPerfil(request).subscribe({
        next: (response: any) => { 
          this.toast.fire({ icon: 'success', title: '¡Perfil actualizado!' });
          
          this.fotoUrlActual = urlFotoFinal;
          this.archivoSeleccionado = null;

          if (response?.data?.token) {
            this.authService.setToken(response.data.token); 
            setTimeout(() => window.location.reload(), 3000); // 🌟 Pequeña espera para que se lea el toast antes del reload
          }

        },
        error: (err) => {
          console.error(err);
          this.toast.fire({ icon: 'error', title: 'Error al actualizar perfil.' });
        },
        complete: () => {
          this.cargando = false;
        }
      });

    } catch (error) {
       console.error("Error en el proceso de guardado:", error);
       this.toast.fire({ icon: 'error', title: 'Ocurrió un error inesperado.' });
       this.cargando = false;
    }
  }
}