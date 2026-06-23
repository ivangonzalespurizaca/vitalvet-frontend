import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitaService } from '../../../../core/services/cita.service';
import { VeterinarioService } from '../../../../core/services/veterinario.service';
import { MascotaService } from '../../../../core/services/mascota.service';
import { AuthService } from '../../../../core/services/auth.service';
import { HorarioService } from '../../../../core/services/horario.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-citas-cliente.component.html',
  styleUrls: ['./registrar-citas-cliente.component.css']
})
export class RegistrarCitaClienteComponent implements OnInit {
  private fb = inject(FormBuilder);
  private citaService = inject(CitaService);
  private vetService = inject(VeterinarioService);
  private mascotaService = inject(MascotaService);
  private authService = inject(AuthService);
  private horarioService = inject(HorarioService);

  numeroTarjeta: string = '';
  expiraTarjeta: string = '';
  formulario!: FormGroup;
  mostrarModalPago = false;
  mascotas: any[] = [];
  veterinarios: any[] = [];
  slots: any[] = [];
  horariosVeterinario: any[] = [];
  montoFijo = 50.00;

  ngOnInit() {
    this.iniciarFormulario();
    this.cargarDatosIniciales();
  }

iniciarFormulario() {
  this.formulario = this.fb.group({
    idVeterinario: ['', Validators.required],
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    idMascota: ['', Validators.required],
    motivo: [''],
    tipoDocumento: ['BOLETA', Validators.required],
    metodoPago: ['TARJETA_DEBITO', Validators.required],
    // NUEVOS CAMPOS:
    numeroTarjeta: [''],
    expira: [''],
    cvc: ['']
  });
}

  cargarDatosIniciales() {
    this.vetService.listarVeterinarios('').subscribe(res => this.veterinarios = res.data);
    const idCliente = this.authService.getIdPersona();
    if (idCliente !== null) {
      this.mascotaService.listarPorCliente(idCliente).subscribe(res => this.mascotas = res.data);
    }
  }

  cargarSlots() {
    const { idVeterinario, fecha } = this.formulario.value;
    if (idVeterinario && fecha) {
      this.citaService.listarSlotsDisponibles(idVeterinario, fecha).subscribe(res => this.slots = res.data);
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

// Reemplaza estas funciones por estas versiones simples
formatearTarjeta(event: any) {
  // Solo permitimos números, el resto lo dejamos fluir natural
  let value = event.target.value.replace(/\D/g, '');
  this.formulario.patchValue({ numeroTarjeta: value }, { emitEvent: false });
}

formatearFecha(event: any) {
  let value = event.target.value.replace(/\D/g, '');
  this.formulario.patchValue({ expira: value }, { emitEvent: false });
}

 confirmarCita() {
  const form = this.formulario.value;
  if (!form.hora) {
    alert("Por favor selecciona un horario");
    return;
  }

  // 1. Normalización total: quitamos puntos, espacios extra y convertimos a minúsculas
  const horaRaw = form.hora.toLowerCase().replace(/\s+/g, '').replace(/\./g, '');
  
  // 2. Extraer horas y minutos. Buscamos números antes y después de los dos puntos
  const match = horaRaw.match(/(\d{1,2}):(\d{2})/);
  if (!match) {
    alert("Formato de hora no reconocido");
    return;
  }

  let horas = parseInt(match[1], 10);
  const minutos = match[2];
  
  // 3. Detectar si es PM (si contiene 'p')
  const esPM = horaRaw.includes('p');

  // 4. Conversión lógica a 24 horas
  if (esPM && horas < 12) {
    horas += 12;
  } else if (!esPM && horas === 12) {
    horas = 0;
  }

  // 5. Formatear a HH:mm:ss
  const horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos}:00`;

  const request = {
    ...form,
    idCliente: this.authService.getIdPersona(),
    hora: horaFormateada,
    montoTotal: this.montoFijo
  };

  console.log("Payload enviado al servidor:", request);

  this.citaService.registrarCita(request).subscribe({
    next: () => {
      alert('¡Reserva confirmada y pago procesado exitosamente!');
      this.mostrarModalPago = false;
      this.formulario.reset();
    },
    error: (err) => {
      console.error(err);
      alert('Error al reservar: ' + (err.error?.mensaje || 'Error desconocido'));
    }
  });
}
}