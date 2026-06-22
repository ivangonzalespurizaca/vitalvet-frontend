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
      // Campos fijos para el pago interno
      tipoDocumento: ['BOLETA'],
      metodoPago: ['TARJETA_DEBITO']
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

 confirmarCita() {
  const form = this.formulario.value;
  let horaRaw = form.hora; // Ejemplo esperado: "03:00 p. m." o "09:00 a. m."
  
  // 1. Extraemos solo los números de la hora y los minutos
  const match = horaRaw.match(/(\d{1,2}):(\d{2})/);
  let hInt = parseInt(match[1]);
  const m = match[2];

  // 2. Detectamos si es PM y no es 12
  const isPM = horaRaw.toLowerCase().includes('p. m.');
  if (isPM && hInt !== 12) {
    hInt += 12;
  }
  // 3. Caso especial: 12 a. m. es 00:00
  if (!isPM && hInt === 12) {
    hInt = 0;
  }

  // 4. Formateamos a HH:mm:ss
  const horaFormateada = `${hInt.toString().padStart(2, '0')}:${m}:00`;

  const request = {
    ...form,
    idCliente: this.authService.getIdPersona(),
    hora: horaFormateada,
    montoTotal: this.montoFijo
  };

  console.log("Payload FINAL enviado al servidor:", JSON.stringify(request, null, 2));

  this.citaService.registrarCita(request).subscribe({
    next: () => {
      alert('¡Reserva confirmada y pago procesado exitosamente!');
      this.mostrarModalPago = false;
      this.formulario.reset();
    },
    error: (err) => alert('Error al reservar: ' + (err.error?.mensaje || 'Error desconocido'))
  });
}
}