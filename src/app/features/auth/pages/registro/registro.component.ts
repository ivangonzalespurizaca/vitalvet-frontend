import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import { CatalogoService } from '../../../../core/services/catalogo.service';
import { Especie, Raza } from '../../../../core/interfaces/catalogos';
import Swal from 'sweetalert2';

export const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('contrasenia')?.value;
  const confirmPassword = control.get('confirmarContrasenia')?.value;

  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordsMismatch: true };
  }
  return null;
};

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private catalogoService = inject(CatalogoService);
  private router = inject(Router);
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

  pasoActual = 1;
  fechaMaxima = new Date().toISOString().split('T')[0];
  especies: Especie[] = [];
  todasLasRazas: Raza[] = [];
  razasFiltradas: Raza[] = [];

  registroForm = this.fb.group({
    datosCliente: this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasenia: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      celular: [''],
      genero: ['MASCULINO', [Validators.required]]
    }, { validators: passwordsMatchValidator }),

    datosMascota: this.fb.group({
      nombreMascota: ['', [Validators.required]],
      idEspecie: [null as number | null, [Validators.required]], // 👈 Temporal para filtrar
      idRaza: [{ value: null as number | null, disabled: true }, [Validators.required]], // 👈 Deshabilitado por defecto
      sexo: ['HEMBRA', [Validators.required]],
      fechaNacimiento: ['']
    })
  });

  ngOnInit(): void {
    this.cargarCatalogos();
    this.escucharCambiosDeEspecie();
  }

  // 1. Carga los datos de tu Spring Boot
  private cargarCatalogos(): void {
    this.catalogoService.obtenerEspeciesActivas().subscribe(res => {
      if (res.success) this.especies = res.data;
    });

    this.catalogoService.obtenerTodasLasRazasActivas().subscribe(res => {
      if (res.success) this.todasLasRazas = res.data;
    });
  }

  // 2. Filtro en cascada
  private escucharCambiosDeEspecie(): void {
    const idRazaControl = this.registroForm.get('datosMascota.idRaza');

    this.registroForm.get('datosMascota.idEspecie')?.valueChanges.subscribe(idEspecie => {
      // Al cambiar especie, reseteamos la raza seleccionada
      idRazaControl?.setValue(null);

      if (idEspecie) {
        // Filtramos buscando las razas que coincidan con la especie
        this.razasFiltradas = this.todasLasRazas.filter(r => r.idEspecie === Number(idEspecie));
        idRazaControl?.enable();
      } else {
        this.razasFiltradas = [];
        idRazaControl?.disable();
      }
    });
  }

  siguientePaso(): void {
    if (this.pasoActual < 3) this.pasoActual++;
  }

  pasoAnterior(): void {
    if (this.pasoActual > 1) this.pasoActual--;
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      const payload = this.registroForm.getRawValue() as any;
      const credenciales = {
        email: payload.datosCliente.email,
        contrasenia: payload.datosCliente.contrasenia
      };

      delete payload.datosCliente.confirmarContrasenia;
      delete payload.datosMascota.idEspecie;

      this.authService.registrar(payload).subscribe({
        next: (res: any) => {
          // 🌟 Éxito en el registro
          this.toast.fire({ icon: 'success', title: 'Registro exitoso. Iniciando sesión...' });

          this.authService.login(credenciales).subscribe({
            next: (loginRes) => {
              this.router.navigate(['/cliente/dashboard']);
            },
            error: (loginErr) => {
              // 🌟 Error en login automático
              this.toast.fire({ icon: 'info', title: 'Cuenta creada, por favor inicia sesión.' });
              this.router.navigate(['/login']);
            }
          });
        },
        error: (err: HttpErrorResponse) => {
          // 🌟 Error en el registro
          const mensajeError = err.error?.mensaje || 'Error al registrar usuario.';
          this.toast.fire({ icon: 'error', title: mensajeError });
        }
      });
    } else {
      this.registroForm.markAllAsTouched();
      // 🌟 Alerta de formulario incompleto
      this.toast.fire({ icon: 'warning', title: 'Por favor, completa los campos correctamente.' });
    }
  }

  get contraseniaNoCoincide() {
    return this.registroForm.get('datosCliente')?.hasError('passwordsMismatch') &&
      this.registroForm.get('datosCliente.confirmarContrasenia')?.touched;
  }

  get paso1Invalido(): boolean {
    const grupo = this.registroForm.get('datosCliente');
    return grupo?.get('email')?.invalid ||
      grupo?.get('contrasenia')?.invalid ||
      grupo?.get('confirmarContrasenia')?.invalid ||
      grupo?.hasError('passwordsMismatch') || false;
  }

  get contraseniaControl() {
    return this.registroForm.get('datosCliente.contrasenia');
  }

  get paso2Invalido(): boolean {
    return this.registroForm.get('datosCliente')?.invalid || false;
  }
}