import { Component, inject, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
// 1. Importar el módulo y los iconos específicos
import { 
  LucideAngularModule, 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  BookOpen, 
  Calendar, 
  Receipt, 
  History, 
  ClipboardList, 
  Syringe, 
  Clock, 
  Dog, 
  Wallet 
} from 'lucide-angular';

interface MenuItem {
  label: string;
  route: string;
  roles: string[];
  icon: any; // 2. Añadir propiedad para el icono
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, LucideAngularModule], // 3. Importar LucideAngularModule
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  private authService = inject(AuthService);

  // 4. Mapear los iconos a los items del menú
  menuItems: MenuItem[] = [
    // ADMIN
    { label: 'Inicio / Dashboard', route: '/admin/dashboard', roles: ['ADMINISTRADOR'], icon: LayoutDashboard },
    { label: 'Clientes / Dueños', route: '/clientes', roles: ['ADMINISTRADOR'], icon: Users },
    { label: 'Veterinarios', route: '/veterinarios', roles: ['ADMINISTRADOR'], icon: Stethoscope },
    { label: 'Citas Médicas', route: '/admin/citas', roles: ['ADMINISTRADOR'], icon: Calendar },
    { label: 'Comprobantes de Pago', route: '/admin/comprobantes', roles: ['ADMINISTRADOR'], icon: Receipt },
    { label: 'Log Usuarios', route: '/admin/logs', roles: ['ADMINISTRADOR'], icon: History },
    
    // VETERINARIO
    { label: 'Inicio / Dashboard', route: '/veterinario/dashboard', roles: ['VETERINARIO'], icon: LayoutDashboard },
    { label: 'Consultas Médicas', route: '/veterinario/consultas', roles: ['VETERINARIO'], icon: ClipboardList },
    { label: 'Vacunación', route: '/veterinario/gestion-vacunas', roles: ['VETERINARIO'], icon: Syringe },
    { label: 'Agenda Médica', route: '/veterinario/mi-agenda', roles: ['VETERINARIO'], icon: Clock },
    
    // CLIENTE
    { label: 'Inicio / Dashboard', route: '/cliente/dashboard', roles: ['CLIENTE'], icon: LayoutDashboard },
    { label: 'Mis Mascotas', route: '/cliente/mis-mascotas', roles: ['CLIENTE'], icon: Dog },
    { label: 'Mis Citas', route: '/cliente/mis-citas', roles: ['CLIENTE'], icon: Calendar },
    { label: 'Pagos Realizados', route: '/cliente/mis-comprobantes', roles: ['CLIENTE'], icon: Wallet }
  ];

  filteredMenuItems = computed(() => {
    const userRole = this.authService.getUserRole();
    return this.menuItems.filter(item => item.roles.includes(userRole!));
  });
}