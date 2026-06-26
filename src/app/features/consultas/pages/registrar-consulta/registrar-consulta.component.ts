import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaService } from '../../../../core/services/consulta.service';
import { VacunaDTO } from '../../../../core/interfaces/vacuna';
import { VacunaService } from '../../../../core/services/vacuna.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-consulta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ¡Crucial para que funcionen los formularios!
  templateUrl: './registrar-consulta.component.html',
  styleUrls: ['./registrar-consulta.component.css']
})
export class RegistrarConsultaComponent implements OnInit {
  private vacunaService = inject(VacunaService);
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

  form: FormGroup;
  idMascota!: number;
  vacunasDisponibles: VacunaDTO[] = [];
  nombreMascota: string = '';
  motivoConsulta: string = '';
  get vacunasControls() {
    return (this.form.get('vacunas') as FormArray).controls;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private consultaService: ConsultaService,
    private router: Router
    
  ) {
    this.form = this.fb.group({
      idCita: [null, Validators.required],
      pesoActual: [
        '',
        [
          Validators.required,
          Validators.min(0.1)
        ]
      ],
      temperatura: [
        '',
        [
          Validators.required,
          Validators.min(30),
          Validators.max(45)
        ]
      ],
      diagnostico: [
        '',
        [
          Validators.required,
          Validators.minLength(10)
        ]
      ],
      recomendaciones: [
        '',
        [
          Validators.required,
          Validators.minLength(10)
        ]
      ],
      vacunas: this.fb.array([])
    });
  }

  ngOnInit() {
    this.idMascota = Number(this.route.snapshot.paramMap.get('idMascota'));
    this.cargarVacunas();

    this.route.queryParams.subscribe(params => {
      // Captura los nuevos parámetros
      this.nombreMascota = params['mascota'] || 'Desconocido';
      this.motivoConsulta = params['motivo'] || 'Sin motivo';

      if (params['idCita']) {
        this.form.patchValue({ idCita: Number(params['idCita']) });
        this.form.get('idCita')?.disable();
      }
    });
  }

  cargarVacunas() {
    this.vacunaService.listarActivas().subscribe(res => {
      this.vacunasDisponibles = res.data;
    });
  }

  agregarVacuna() {

    const vacunaGroup = this.fb.group({

      idVacuna: [
        null,
        Validators.required
      ],

      nroDosis: [
        '',
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      proximaDosis: [
        '',
        Validators.required
      ]

    });

    (this.form.get('vacunas') as FormArray).push(vacunaGroup);

  }

  quitarVacuna(index: number) {
    (this.form.get('vacunas') as FormArray).removeAt(index);
  }

guardar() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    this.swalToast.fire({
      icon: 'warning',
      title: 'Complete todos los campos obligatorios.'
    });
    return;
  }
  const data = this.form.getRawValue();
  this.consultaService
    .registrarConsulta(this.idMascota, data)
    .subscribe({
      next: (res) => {
        this.swalToast.fire({
          icon: 'success',
          title: res.mensaje || 'Consulta registrada correctamente.'
        });
        setTimeout(() => {
          this.router.navigate(['/veterinario/consultas']);
        }, 1200);
      },
      error: (err) => {
        this.swalToast.fire({
          icon: 'error',
          title: err.error?.mensaje || 'Ocurrió un error al registrar la consulta.'
        });
      }
    });
  }
}