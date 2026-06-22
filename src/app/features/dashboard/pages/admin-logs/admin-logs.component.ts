import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminLogsService } from '../../../../core/services/admin-logs.service';
import { ClienteService } from '../../../../core/services/cliente.service';

@Component({
  selector: 'app-admin-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-logs.component.html',
  styleUrls: ['./admin-logs.component.css']
})
export class AdminLogsComponent implements OnInit {

  logs: any[] = [];

  filtros = {
    usuarioOrId: '',
    modulo: '',
    accion: '',
    fecha: ''
  };

  constructor(
    private adminLogsService: AdminLogsService,
    private clienteService: ClienteService // Corregido a minúscula por convención de buenas prácticas
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
      // Validamos que exista el idUsuario en el registro del log
      if (log.idUsuario) {
        this.clienteService.obtenerPorId(log.idUsuario).subscribe({
          next: (res) => {
            // Estructura de tu API: res.success y res.data
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
      } else {
        log.nombreCompleto = 'Sin ID de Usuario';
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
}