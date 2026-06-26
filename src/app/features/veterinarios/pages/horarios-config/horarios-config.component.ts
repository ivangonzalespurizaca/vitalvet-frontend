import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HorarioService } from '../../../../core/services/horario.service';
import { HorarioResponse, HorarioRequest, HorarioDetalle } from '../../../../core/interfaces/horario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-horarios-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './horarios-config.component.html',
  styleUrls: ['./horarios-config.component.css']
})
export class HorariosConfigComponent implements OnInit {
  private fb = inject(FormBuilder);
  private hService = inject(HorarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private swalToast = Swal.mixin({
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

  veterinarioId!: number;
  veterinarioData: HorarioResponse | null = null;
  horarios: HorarioDetalle[] = [];
  formulario!: FormGroup;
  cargando = false;
  dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
  // En tu clase del componente, define el rango de 07 a 22
  hours: string[] = Array.from({ length: 16 }, (_, i) => (i + 7).toString().padStart(2, '0'));

  ngOnInit() {
    this.veterinarioId = Number(this.route.snapshot.paramMap.get('id'));
    this.iniciarFormulario();
    this.cargarDatos();
  }

  iniciarFormulario() {
    this.formulario = this.fb.group({
      diaSemana: ['', Validators.required],
      hourStart: ['07', Validators.required], // Coincide con tu HTML
      hourEnd: ['08', Validators.required]    // Coincide con tu HTML
    });
  }

  cargarDatos() {
    this.hService.obtenerPorVeterinario(this.veterinarioId).subscribe(res => {
      if (res.success) {
        this.veterinarioData = res.data;
        this.horarios = res.data.horarios;
      }
    });
  }

  guardarHorario() {

    if (this.formulario.get('diaSemana')?.invalid) {
      this.formulario.get('diaSemana')?.markAsTouched();
      return;
    }

    this.cargando = true;

    const formValue = this.formulario.value;

    if (parseInt(formValue.hourStart) >= parseInt(formValue.hourEnd)) {

      this.swalToast.fire({
        icon: 'warning',
        title: 'La hora de salida debe ser posterior a la de entrada.'
      });

      this.cargando = false;
      return;
    }

    const request: HorarioRequest = {
      idVeterinario: this.veterinarioId,
      diaSemana: formValue.diaSemana,
      horaInicio: `${formValue.hourStart}:00:00`,
      horaFin: `${formValue.hourEnd}:00:00`
    };

    this.hService.registrarHorario(request).subscribe({

      next: (res) => {

        this.cargando = false;

        this.swalToast.fire({
          icon: 'success',
          title: res.mensaje || 'Horario registrado correctamente.'
        });

        this.formulario.reset({
          diaSemana: '',
          hourStart: '07',
          hourEnd: '08'
        });

        this.cargarDatos();
      },

      error: (err) => {

        this.cargando = false;

        this.swalToast.fire({
          icon: 'error',
          title: err.error?.mensaje || 'Error al registrar el horario.'
        });

      }

    });

  }

  eliminar(id: number) {

    Swal.fire({
      title: '¿Eliminar horario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {

      if (!result.isConfirmed) return;

      this.cargando = true;

      this.hService.eliminarHorario(id).subscribe({

        next: (res) => {

          this.cargando = false;

          this.swalToast.fire({
            icon: 'success',
            title: res.mensaje || 'Horario eliminado correctamente.'
          });

          this.cargarDatos();

        },

        error: (err) => {

          this.cargando = false;

          this.swalToast.fire({
            icon: 'error',
            title: err.error?.mensaje || 'No se pudo eliminar el horario.'
          });

        }

      });

    });

  }
}