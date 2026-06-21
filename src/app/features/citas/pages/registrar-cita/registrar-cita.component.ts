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
      tipoDocumento: ['Boleta de Pago'],
      metodoPago: ['Efectivo (Caja Física)']
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
    
    if (dni && dni.length >= 8) {
      this.vacunacionService.buscarPanelPorDni(dni).subscribe({
        next: (data: MascotasResponse) => {
          // Asignación directa: data ya tiene la estructura MascotasResponse
          this.cliente = data; 
          this.mascotas = data.mascotas || [];
        },
        error: (err) => {
          this.cliente = null;
          this.mascotas = [];
          alert('Cliente no encontrado');
        }
      });
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
    if(this.formulario.valid) this.mostrarModalPago = true;
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
    // Verificación de seguridad antes de acceder a datos
    if (!this.cliente || !this.formulario.valid) {
        alert('Por favor complete todos los datos requeridos');
        return;
    }

    

    const form = this.formulario.value;

    const horaLimpia = form.hora.split(' ')[0] + ':00';
    
    // Usamos 'idPersona' porque así está definido en tu interfaz MascotasResponse
    const request: CitaRequestDTO = {
      idMascota: Number(form.idMascota),
      idVeterinario: Number(form.idVeterinario),
      fecha: form.fecha,
      hora: horaLimpia,
      motivo: form.motivo || '',
      idCliente: this.cliente.idPersona, 
      tipoDocumento: form.tipoDocumento,
      metodoPago: form.metodoPago,
      montoTotal: this.montoFijo
    };

    console.log('Payload enviado al servidor:', JSON.stringify(request));

    this.citaService.registrarCita(request).subscribe({
      next: () => {
        alert('Cita registrada con éxito');
        this.mostrarModalPago = false;
        this.formulario.reset();
      },
      error: (err) => alert('Error al registrar: ' + (err.error?.mensaje || 'Error desconocido'))
    });
  }

}