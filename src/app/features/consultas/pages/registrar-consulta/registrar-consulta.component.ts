import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultaService } from '../../../../core/services/consulta.service';
import { VacunaDTO } from '../../../../core/interfaces/vacuna';
import { VacunaService } from '../../../../core/services/vacuna.service';

@Component({
  selector: 'app-registrar-consulta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ¡Crucial para que funcionen los formularios!
  templateUrl: './registrar-consulta.component.html',
  styleUrls: ['./registrar-consulta.component.css']
})
export class RegistrarConsultaComponent implements OnInit {
  private vacunaService = inject(VacunaService);
  
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
    private consultaService: ConsultaService
  ) {
    this.form = this.fb.group({
      idCita: [null, Validators.required],
      pesoActual: ['', Validators.required],
      temperatura: ['', Validators.required],
      diagnostico: ['', Validators.required],
      recomendaciones: [''],
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
      idVacuna: [null, Validators.required],
      nroDosis: ['', Validators.required],
      proximaDosis: ['']
    });
    (this.form.get('vacunas') as FormArray).push(vacunaGroup);
  }

  quitarVacuna(index: number) {
    (this.form.get('vacunas') as FormArray).removeAt(index);
  }

  guardar() {
    const data = this.form.getRawValue();
    if (this.form.valid) {
      this.consultaService.registrarConsulta(this.idMascota, data)
        .subscribe({
          next: (res) => alert(res.mensaje),
          error: (err) => console.error(err)
        });
    }
  }
}