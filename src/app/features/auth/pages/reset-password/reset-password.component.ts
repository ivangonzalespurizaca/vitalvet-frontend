import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';

// Validador para asegurar que ambas contraseñas coincidan
export const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('nuevaContrasenia')?.value;
  const confirmPassword = control.get('confirmarContrasenia')?.value;
  return password && confirmPassword && password !== confirmPassword ? { passwordsMismatch: true } : null;
};

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

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

  token: string = '';
  cargando = false;

  resetForm = this.fb.group({
    nuevaContrasenia: ['', [Validators.required, Validators.minLength(6)]],
    confirmarContrasenia: ['', [Validators.required]]
  }, { validators: passwordsMatchValidator });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.toast.fire({ icon: 'error', title: 'Enlace inválido o expirado.' });
        this.router.navigate(['/login']);
      }
    });
  }

  onSubmit() {
    if (this.resetForm.valid && this.token) {
      this.cargando = true;
      const nuevaPass = this.resetForm.value.nuevaContrasenia!;

      this.authService.cambiarPassword(this.token, nuevaPass).subscribe({
        next: (res: any) => {
          const mensajeExito = res.mensaje || '¡Contraseña actualizada con éxito!';
          this.toast.fire({ icon: 'success', title: mensajeExito });





          this.router.navigate(['/login']); // Lo mandamos a iniciar sesión
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al cambiar contraseña:', err);
          const mensajeError = err.error?.mensaje || 'El enlace ha expirado o es inválido. Solicita uno nuevo.';
          this.toast.fire({ icon: 'error', title: mensajeError });
          this.cargando = false;
        }
      });
    } else {
      this.resetForm.markAllAsTouched();
    }
  }

  get contraseniaNoCoincide() {
    return this.resetForm.hasError('passwordsMismatch') && this.resetForm.get('confirmarContrasenia')?.touched;
  }
}