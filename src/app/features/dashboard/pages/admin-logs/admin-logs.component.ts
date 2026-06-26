import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminLogsService } from '../../../../core/services/admin-logs.service';
import { ClienteService } from '../../../../core/services/cliente.service';
import { ComentariosSoapService } from '../../../../core/services/comentario-soap.service';
import { VeterinarioService } from '../../../../core/services/veterinario.service';

@Component({
  selector: 'app-admin-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-logs.component.html',
  styleUrls: ['./admin-logs.component.css']
})
export class AdminLogsComponent implements OnInit {

  logs: any[] = [];
  comentariosSoap: any[] = [];
  mostrarModalSoap = false;
  cargandoSoap = false;



  filtros = {
    usuarioOrId: '',
    modulo: '',
    accion: '',
    fecha: ''
  };

  constructor(
    private adminLogsService: AdminLogsService,
    private clienteService: ClienteService ,
    private soapService: ComentariosSoapService,
    private veterinarioService: VeterinarioService
  ) {}

  ngOnInit(): void {
    this.listarLogs();
  }

  listarLogs(): void {
    this.adminLogsService.listar()
      .subscribe({
        next: (data) => {
          this.logs = data;
          this.completarNombresDeUsuarios(); // <-- Llamamos al mapeo aquí
        },
        error: (err) => {
          console.error('Error al obtener logs', err);
        }
      });
  }

  buscar(): void {
  const criterio = this.filtros.usuarioOrId.trim();

  // Si digitan texto en vez de ID, limpiamos o evitamos enviar basura si tu API solo espera números
  if (criterio && isNaN(Number(criterio))) {
    // Opcional: limpiar la lista o lanzar alerta de que solo se permiten números
    this.logs = [];
    return;
  }

  this.adminLogsService.buscar(this.filtros)
    .subscribe({
      next: (data) => {
        this.logs = data;
        this.completarNombresDeUsuarios();
      },
      error: (err) => {
        console.error('Error al filtrar logs', err);
      }
    });
}

  completarNombresDeUsuarios(): void {
  this.logs.forEach(log => {
    
    // 1. Validar si el ID es nulo o no existe (Evita el "Sin ID de Usuario")
    if (log.idUsuario === null || log.idUsuario === undefined) {
      log.nombreCompleto = 'Sin ID de Usuario';
      return; // Saltamos al siguiente log
    }

    // 2. Clasificar el módulo para saber a qué microservicio llamar
    const esModuloVeterinario = log.modulo === 'CITAS' || log.modulo === 'HORARIO';

    if (esModuloVeterinario) {
      // 🩺 Llamada al servicio de Veterinarios
      this.veterinarioService.obtenerPorId(log.idUsuario).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            log.nombreCompleto = `${res.data.nombres} ${res.data.apellidos}`;
          } else {
            log.nombreCompleto = 'Veterinario no encontrado';
          }
        },
        error: (err) => {
          console.error(`Error al traer veterinario con ID ${log.idUsuario}`, err);
          log.nombreCompleto = 'Error al cargar';
        }
      });
    } else {
      // 👥 Llamada al servicio de Clientes/Usuarios (Para MASCOTAS y USUARIOS)
      this.clienteService.obtenerPorId(log.idUsuario).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            log.nombreCompleto = `${res.data.nombres} ${res.data.apellidos}`;
          } else {
            log.nombreCompleto = 'Usuario no encontrado';
          }
        },
        error: (err) => {
          console.error(`Error al traer cliente con ID ${log.idUsuario}`, err);
          log.nombreCompleto = 'Error al cargar';
        }
      });
    }

  });
}

  limpiarFiltros(): void {
    this.filtros = {
      usuarioOrId: '',
      modulo: '',
      accion: '',
      fecha: ''
    };
    this.listarLogs();
  }

  verDetalleSoap() {
    this.mostrarModalSoap = true;
    this.cargandoSoap = true;
    this.comentariosSoap = [];

    this.soapService.obtenerComentariosSoap().subscribe({
      next: (data) => {
        this.comentariosSoap = data;
        this.cargandoSoap = false;
      },
      error: (err) => {
        console.error('Error al traer datos SOAP:', err);
        this.cargandoSoap = false;
      }
    });
  }

  cerrarModal() {
    this.mostrarModalSoap = false;
  }
}