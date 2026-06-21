import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteService } from '../../../../core/services/cliente.service';
import { RegistroRapidoDTO, PersonaRequestDTO } from '../../../../core/interfaces/cliente-request';
import { CatalogoService } from '../../../../core/services/catalogo.service';
import { Especie, Raza } from '../../../../core/interfaces/catalogos';

@Component({
  selector: 'app-cliente-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-modal.component.html',
  styleUrls: ['./cliente-modal.component.css']
})
export class ClienteModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private catalogoService = inject(CatalogoService);

  @Input() clienteId: number | null = null; 
  @Output() cerrarModal = new EventEmitter<void>(); 
  @Output() operacionExitosa = new EventEmitter<void>(); 

  formulario!: FormGroup;
  cargando = false;
  esModoEdicion = false;
  especies: Especie[] = [];
  todasLasRazas: Raza[] = [];
  razasFiltradas: Raza[] = [];

  ngOnInit() {
    this.cargarCatalogos(); // Cargar catálogos
    this.esModoEdicion = this.clienteId !== null;
    this.iniciarFormulario();
    this.escucharCambiosDeEspecie();

    if (this.esModoEdicion && this.clienteId) {
      this.cargarDatosCliente(this.clienteId);
    }
  }

  private cargarCatalogos(): void {
    this.catalogoService.obtenerEspeciesActivas().subscribe(res => {
      if (res.success) this.especies = res.data;
    });
    this.catalogoService.obtenerTodasLasRazasActivas().subscribe(res => {
      if (res.success) this.todasLasRazas = res.data;
    });
  }

  private escucharCambiosDeEspecie(): void {
    const idRazaControl = this.formulario.get('datosMascota.idRaza');
    
    this.formulario.get('datosMascota.idEspecie')?.valueChanges.subscribe(idEspecie => {
      idRazaControl?.setValue(null); // Resetea la raza al cambiar especie
      
      if (idEspecie) {
        // Filtramos localmente usando las razas que ya cargamos
        this.razasFiltradas = this.todasLasRazas.filter(r => r.idEspecie === Number(idEspecie));
        idRazaControl?.enable();
      } else {
        this.razasFiltradas = [];
        idRazaControl?.disable();
      }
    });
  }

  private iniciarFormulario() {
    this.formulario = this.fb.group({
      datosCliente: this.fb.group({
        dni: ['', [Validators.required, Validators.maxLength(12), Validators.minLength(8)]],
        nombres: ['', Validators.required],
        apellidos: ['', Validators.required],
        celular: [''],
        genero: ['', Validators.required]
      }),
      datosMascota: this.fb.group({
        nombreMascota: [this.esModoEdicion ? 'N/A' : '', this.esModoEdicion ? [] : Validators.required],
        idEspecie: [null, Validators.required],
        idRaza: [{ value: null, disabled: true }, Validators.required],
        sexo: [this.esModoEdicion ? 'N/A' : '', this.esModoEdicion ? [] : Validators.required]
      })
    });
  }

  private cargarDatosCliente(id: number) {
    this.cargando = true;
    this.clienteService.obtenerPorId(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.formulario.get('datosCliente')?.patchValue({
            dni: res.data.dni,
            nombres: res.data.nombres,
            apellidos: res.data.apellidos,
            celular: res.data.celular,
            genero: res.data.genero || ''
          });
          // Nota: El backend en obtenerPorId no devuelve el género en ClienteResponse. 
          // Si lo necesitas para editar, deberás añadirlo al DTO de Java en el futuro.
        }
      },
      error: () => alert('Error al cargar datos del cliente'),
      complete: () => this.cargando = false
    });
  }

  guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;

    if (this.esModoEdicion && this.clienteId) {
      const requestEditar: PersonaRequestDTO = this.formulario.get('datosCliente')?.value;
      
      this.clienteService.editarCliente(this.clienteId, requestEditar).subscribe({
        next: (res) => {
          alert(res.mensaje);
          this.operacionExitosa.emit(); 
        },
        error: (err) => {
          alert(err.error?.mensaje || 'Error al editar cliente');
          this.cargando = false;
        }
      });

    } else {
      const requestCrear: RegistroRapidoDTO = {
        datosCliente: this.formulario.get('datosCliente')?.value,
        datosMascota: {
          ...this.formulario.get('datosMascota')?.value,
          idRaza: Number(this.formulario.get('datosMascota.idRaza')?.value) 
        }
      };

      this.clienteService.registroRapido(requestCrear).subscribe({
        next: (res) => {
          alert(res.mensaje);
          this.operacionExitosa.emit();
        },
        error: (err) => {
          alert(err.error?.mensaje || 'Error al registrar cliente');
          this.cargando = false;
        }
      });
    }
  }

  cancelar() {
    this.cerrarModal.emit();
  }
}