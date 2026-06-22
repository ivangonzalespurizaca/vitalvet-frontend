import { Component, inject, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  label: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private authService = inject(AuthService);

  // Definición maestra de todos los menús de la aplicación
  menuItems: MenuItem[] = [
    { label: 'Inicio / Dashboard', route: '/admin/dashboard', roles: ['ADMINISTRADOR'] },
    { label: 'Clientes / Dueños', route: '/clientes', roles: ['ADMINISTRADOR'] },
    { label: 'Veterinarios', route: '/veterinarios', roles: ['ADMINISTRADOR'] },
    { label: 'Catálogos', route: '/admin/catalogos', roles: ['ADMINISTRADOR'] },
    { label: 'Citas Médicas', route: '/admin/citas', roles: ['ADMINISTRADOR'] },
    { label: 'Comprobantes de Pago', route: '/admin/comprobantes', roles: ['ADMINISTRADOR'] },
    { label: 'Log Usuarios', route: '/admin/logs', roles: ['ADMINISTRADOR'] },
    { label: 'Inicio / Dashboard', route: '/veterinario/dashboard', roles: ['VETERINARIO'] },
    { label: 'Consultas Médicas', route: '/veterinario/consultas', roles: ['VETERINARIO'] },
    { label: 'Vacunación', route: '/veterinario/gestion-vacunas', roles: ['VETERINARIO'] },
    { label: 'Agenda Médica', route: '/veterinario/mi-agenda', roles: ['VETERINARIO'] },
    { label: 'Inicio / Dashboard', route: '/cliente/dashboard', roles: ['CLIENTE'] },
    { label: 'Mis Mascotas', route: '/cliente/mis-mascotas', roles: ['CLIENTE'] },
    { label: 'Mis Citas', route: '/cliente/mis-citas', roles: ['CLIENTE'] },
    { label: 'Pagos Realizados', route: '/cliente/mis-pagos', roles: ['CLIENTE'] }
  ];

  // Filtramos los items basándonos en el rol del usuario autenticado
  filteredMenuItems = computed(() => {
    const userRole = this.authService.getUserRole();
    return this.menuItems.filter(item => item.roles.includes(userRole!));
  });
}