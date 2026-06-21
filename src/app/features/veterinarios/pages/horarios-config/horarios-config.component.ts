import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HorarioService } from '../../../../core/services/horario.service';
import { HorarioResponse, HorarioRequest, HorarioDetalle } from '../../../../core/interfaces/horario';

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

  veterinarioId!: number;
  veterinarioData: HorarioResponse | null = null;
  horarios: HorarioDetalle[] = [];
  formulario!: FormGroup;
  dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
  // En tu clase del componente, define el rango de 07 a 22
  hours: string[] = Array.from({length: 16}, (_, i) => (i + 7).toString().padStart(2, '0'));

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
    if (this.formulario.invalid) return;

    const formValue = this.formulario.value;

    // Validación de lógica horaria
    if (parseInt(formValue.hourStart) >= parseInt(formValue.hourEnd)) {
      alert('La hora de fin debe ser posterior a la de entrada.');
      return;
    }

    const request: HorarioRequest = {
      idVeterinario: this.veterinarioId,
      diaSemana: formValue.diaSemana,
      // Usamos las variables correctas
      horaInicio: `${formValue.hourStart}:00:00`,
      horaFin: `${formValue.hourEnd}:00:00`
    };

    this.hService.registrarHorario(request).subscribe({
      next: () => {
        alert('Horario registrado correctamente');
        this.formulario.reset({ diaSemana: '', hourStart: '07', hourEnd: '08' });
        this.cargarDatos();
      },
      error: (err) => alert(err.error?.mensaje || 'Error al guardar')
    });
  }

  eliminar(id: number) {
    if(confirm('¿Desea eliminar este horario?')) {
      this.hService.eliminarHorario(id).subscribe(() => this.cargarDatos());
    }
  }
}