import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitaService } from '../../../../core/services/cita.service';
import { VeterinarioService } from '../../../../core/services/veterinario.service';
import { RouterModule } from '@angular/router';
import { ClienteService } from '../../../../core/services/cliente.service';
import { VacunacionService } from '../../../../core/services/vacunacion.service';
import { MascotaResponseDTO, MascotasResponse } from '../../../../core/interfaces/mascota-response';
import { CitaRequestDTO } from '../../../../core/interfaces/cita';
import { VeterinarioResponse } from '../../../../core/interfaces/veterinario-response';
import { HorarioService } from '../../../../core/services/horario.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registrar-cita.component.html',
  styleUrls: ['./registrar-cita.component.css']
})
export class RegistrarCitaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private citaService = inject(CitaService);
  private vetService = inject(VeterinarioService);
  private clienteService = inject(ClienteService);
  private horarioService = inject(HorarioService);

  formulario!: FormGroup;
  mostrarModalPago = false;
  
  // Datos para los Selectores
  veterinarios: VeterinarioResponse[] = [];
  slots: any[] = [];
  cliente: MascotasResponse | null = null; 
  mascotas: MascotaResponseDTO[] = [];
  horariosVeterinario: any[] = [];
  montoFijo = 50.00;

  ngOnInit() {
    this.iniciarFormulario();
    this.cargarVeterinarios();
  }

iniciarFormulario() {
  this.formulario = this.fb.group({
    idVeterinario: ['', Validators.required],
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    dniCliente: ['', Validators.required],
    idMascota: ['', Validators.required],
    motivo: [''],
    // Valores exactos del Enum en Java
    tipoDocumento: ['BOLETA', Validators.required],
    metodoPago: ['EFECTIVO', Validators.required]
  });
}

  cargarVeterinarios() {
    this.vetService.listarVeterinarios('').subscribe(res => {
      if (res.success) {
        this.veterinarios = res.data.filter(v => v.activo === true);
      }
    });
  }

// En tu RegistrarCitaComponent
private vacunacionService = inject(VacunacionService); // Inyecta el nuevo servicio

buscarCliente() {
  const dni = this.formulario.get('dniCliente')?.value;
  console.log("Buscando DNI:", dni); // ¿Ves esto en consola?
  
  if (dni && dni.length >= 8) {
    this.vacunacionService.buscarPanelPorDni(dni).subscribe({
      next: (data) => {
        console.log("Datos recibidos:", data); // ¿Llegan los datos?
        this.cliente = data;
        this.mascotas = data.mascotas || [];
      },
      error: (err) => {
        console.error("Error en buscarCliente:", err); // ¿Ves este error?
        alert('Cliente no encontrado');
      }
    });
  } else {
    console.warn("DNI muy corto"); // Quizás no entra al IF
  }
}
cargarSlots() {
  const { idVeterinario, fecha } = this.formulario.value;
  if (idVeterinario && fecha) {
    this.citaService.listarSlotsDisponibles(idVeterinario, fecha).subscribe(res => {
      this.slots = res.data; 
    });
  }
}

  cargarHorariosVeterinario() {
  const idVeterinario = this.formulario.get('idVeterinario')?.value;
  
    if (idVeterinario) {
      this.horarioService.obtenerPorVeterinario(idVeterinario).subscribe({
        next: (res) => {
          // Asumiendo que res.data tiene una propiedad 'horarios' como en tu endpoint
          this.horariosVeterinario = res.data.horarios || [];
        },
        error: () => this.horariosVeterinario = []
      });
    }
  }

abrirModalPago() {
  if (this.formulario.valid) {
    this.mostrarModalPago = true;
  } else {
    // Esto te dirá qué campo falta por llenar
    this.formulario.markAllAsTouched(); // Marca todos como "tocados" para que se vean errores
    console.log("Campos inválidos:", this.findInvalidControls());
    alert("Por favor, completa todos los campos obligatorios antes de continuar.");
  }
}

findInvalidControls() {
  const invalid = [];
  const controls = this.formulario.controls;
  for (const name in controls) {
    if (controls[name].invalid) {
      invalid.push(name);
    }
  }
  return invalid;
}

  seleccionarHora(hora: string) {
    this.formulario.patchValue({ hora: hora });
  }

  obtenerNombreMascotaSeleccionada(): string {
  const id = this.formulario.get('idMascota')?.value;
  const mascota = this.mascotas.find(m => m.idMascota == id);
  return mascota ? `${mascota.nombreMascota} (${mascota.nombreRaza})` : 'No seleccionada';
}

obtenerNombreVeterinarioSeleccionado(): string {
  const id = this.formulario.get('idVeterinario')?.value;
  const vet = this.veterinarios.find(v => v.idVeterinario == id);
  return vet ? `${vet.nombres} ${vet.apellidos}` : 'No seleccionado';
}

confirmarCita() {
if (!this.cliente || !this.formulario.valid) {
    alert('Por favor complete todos los datos requeridos');
    return;
  }

  const form = this.formulario.value;
  const horaRaw = form.hora; // "05:00 p. m."

  // 1. Limpiamos el string para que solo queden números y la palabra pm/am
  const esPM = horaRaw.toLowerCase().includes('p'); // Si tiene una 'p' (de p.m.), es PM
  const partes = horaRaw.match(/(\d+):(\d+)/);
  
  if (!partes) return;

  let horas = parseInt(partes[1], 10);
  const minutos = partes[2];

  // 2. Lógica de conversión a 24 horas estricta
  if (esPM) {
    if (horas < 12) horas += 12; // 05:00 p.m. -> 17:00
  } else {
    if (horas === 12) horas = 0; // 12:00 a.m. -> 00:00
  }

  // 3. Formatear a HH:mm:ss
  const horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos}:00`;

  const request: CitaRequestDTO = {
    idMascota: Number(form.idMascota),
    idVeterinario: Number(form.idVeterinario),
    fecha: form.fecha,
    hora: horaFormateada,
    motivo: form.motivo || '',
    idCliente: this.cliente.idPersona,
    tipoDocumento: form.tipoDocumento,
    metodoPago: form.metodoPago,
    montoTotal: this.montoFijo
  };

  console.log("Enviando hora formateada:", horaFormateada); // Debería salir 14:00:00

  this.citaService.registrarCita(request).subscribe({
    next: () => {
      alert('Cita registrada con éxito');
      this.mostrarModalPago = false;
      this.formulario.reset();
    },
    error: (err) => {
      console.error(err);
      alert('Error: ' + (err.error?.mensaje || 'Conflicto al guardar la cita'));
    }
  });
}

}