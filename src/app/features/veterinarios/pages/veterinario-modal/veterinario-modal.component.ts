import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VeterinarioService } from '../../../../core/services/veterinario.service';
import { CatalogoService } from '../../../../core/services/catalogo.service';

@Component({
  selector: 'app-veterinario-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './veterinario-modal.component.html',
  styleUrls: ['./veterinario-modal.component.css']
})
export class VeterinarioModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private vService = inject(VeterinarioService);
  private catService = inject(CatalogoService);

  @Input() veterinarioId: number | null = null; // Recibimos el ID para editar
  @Output() cerrar = new EventEmitter<void>();
  @Output() operacionExitosa = new EventEmitter<void>();

  formulario!: FormGroup;
  especialidades: any[] = [];
  cargando = false;
  esModoEdicion = false;

  ngOnInit() {
    this.esModoEdicion = this.veterinarioId !== null;
    this.iniciarFormulario();
    this.cargarEspecialidades();

    if (this.esModoEdicion && this.veterinarioId) {
      this.cargarDatosVeterinario(this.veterinarioId);
    }
  }

  private iniciarFormulario() {
    this.formulario = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      celular: ['', [Validators.required, Validators.pattern('^9[0-9]{8}$')]],
      email: ['', [Validators.required, Validators.email]],
      genero: ['MASCULINO', Validators.required],
      numColegiatura: ['', Validators.required],
      idEspecialidad: ['', Validators.required]
    });
  }

  private cargarEspecialidades() {
    this.catService.obtenerEspecialidadesActivas().subscribe(res => {
      if (res.success) this.especialidades = res.data;
    });
  }

private cargarDatosVeterinario(id: number) {
  this.cargando = true;
  this.vService.obtenerPorId(id).subscribe({
    next: (res) => {
      if (res.success && res.data) {
        const data = res.data;

        // AQUÍ es donde colocas el código para mapear los campos correctamente
        this.formulario.patchValue({
          nombres: data.nombres,
          apellidos: data.apellidos,
          dni: data.dni,
          celular: data.celular,
          email: data.email,
          genero: data.genero,
          // Mapeamos el nombre de la API (nro) al del formulario (num)
          numColegiatura: data.nroColegiatura, 
          // Mapeamos la especialidad
          idEspecialidad: data.idEspecialidad || data.idEspecialidad
        });

        // Después de cargar los datos, bloqueamos el email
        this.formulario.get('email')?.disable();
      }
    },
    error: (err) => {
      console.error('Error al cargar datos:', err);
      this.cargando = false;
    },
    complete: () => (this.cargando = false)
  });
}

  guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const datosFormulario = this.formulario.getRawValue();
  console.log('Datos que se enviarán al PUT:', datosFormulario);
    
    // Decidimos qué servicio llamar según el modo
    const peticion = this.esModoEdicion 
      ? this.vService.editarVeterinario(this.veterinarioId!, this.formulario.value)
      : this.vService.registrarVeterinario(this.formulario.value);

    peticion.subscribe({
      next: (res) => {
        alert(res.mensaje || 'Operación realizada con éxito');
        this.operacionExitosa.emit();
      },
      error: (err) => {
        alert(err.error?.mensaje || 'Error al procesar la solicitud');
        this.cargando = false;
      }
    });
  }
}