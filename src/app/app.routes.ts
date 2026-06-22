import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  // =========================
  // RUTAS PÚBLICAS
  // =========================
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () => import('./features/auth/pages/registro/registro.component').then(m => m.RegistroComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./features/auth/pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  { 
    path: '404', 
    loadComponent: () => import('./shared/pages/not-found/not-found.component').then(m => m.NotFoundComponent) 
  },

  // =========================
  // RUTAS PROTEGIDAS
  // =========================
  {
    path: '',
    loadComponent: () => import('./core/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        loadComponent: () => import('./features/dashboard/pages/dashboard-redirect/dashboard-redirect.component').then(m => m.DashboardRedirectComponent),
        data: { titulo: 'Bienvenido a Vital Vet' }
      },
      {
        path: 'admin/dashboard',
        canActivate: [roleGuard],
        loadComponent: () => import('./features/dashboard/pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        data: { titulo: 'Panel Administrativo', roles: ['ADMINISTRADOR'] }
      },
      {
        path: 'veterinario/dashboard',
        canActivate: [roleGuard],
        loadComponent: () => import('./features/dashboard/pages/vet-dashboard/vet-dashboard.component').then(m => m.VetDashboardComponent),
        data: { titulo: 'Panel de Veterinario', roles: ['VETERINARIO'] }
      },
      {
        path: 'cliente/dashboard',
        canActivate: [roleGuard],
        loadComponent: () => import('./features/dashboard/pages/client-dashboard/client-dashboard.component').then(m => m.ClientDashboardComponent),
        data: { titulo: 'Panel Principal', roles: ['CLIENTE'] }
      },
      {
        path: 'perfil',
        canActivate: [roleGuard],
        loadComponent: () => import('./features/profile/pages/perfil/perfil.component').then(m => m.PerfilComponent),
        data: { titulo: 'Mi Perfil' }
      },
      {
        path: 'clientes',
        canActivate: [roleGuard],
        loadComponent: () => import('./features/clientes/pages/clientes-list/clientes-list.component').then(m => m.ClientesListComponent),
        data: { titulo: 'Directorio de Clientes', roles: ['ADMINISTRADOR'] }
      },
      { 
        path: 'veterinarios', 
        canActivate: [roleGuard],
        loadComponent: () => import('./features/veterinarios/pages/veterinarios-list/veterinarios-list.component').then(m => m.VeterinariosListComponent), 
        data: { titulo: 'Listado de Veterinarios', roles: ['ADMINISTRADOR'] }
      },
      {
        path: 'veterinarios/horarios/:id', 
        canActivate: [roleGuard],
        loadComponent: () => import('./features/veterinarios/pages/horarios-config/horarios-config.component').then(m => m.HorariosConfigComponent),
        data: { titulo: 'Configuración de Horarios', roles: ['ADMINISTRADOR'] }
      },
      {
        path: 'admin/citas',
        canActivate: [roleGuard],
        loadComponent: () => import('./features/citas/pages/citas-list/citas-list.component').then(m => m.CitasListComponent),
        data: { titulo: 'Citas Médicas', roles: ['ADMINISTRADOR'] }
      },
      {
        path: 'admin/citas/registrar',
        loadComponent: () => import('./features/citas/pages/registrar-cita/registrar-cita.component')
          .then(m => m.RegistrarCitaComponent),
        data: { titulo: 'Registrar Cita' }
      },
      {
        path: 'admin/comprobantes',
        canActivate: [roleGuard],
        loadComponent: () => import('./features/comprobantes/pages/comprobantes/comprobantes.component')
          .then(m => m.ComprobantesListComponent),
        data: { titulo: 'Comprobantes de Pago', roles: ['ADMINISTRADOR'] }
      },
      {
        path: 'veterinario/consultas',
        canActivate: [roleGuard],
        loadComponent: () => import('./features/consultas/pages/consultas-list/consultas-list.component')
          .then(m => m.ConsultasListComponent),
        data: { titulo: 'Consultas Médicas', roles: ['VETERINARIO'] }
      },
      {
        path: 'veterinario/consultas/registrar/:idMascota', 
        canActivate: [roleGuard],
        loadComponent: () => import('./features/consultas/pages/registrar-consulta/registrar-consulta.component')
          .then(m => m.RegistrarConsultaComponent),
        data: { titulo: 'Registrar Consulta Médica', roles: ['VETERINARIO'] }
      },
      {
        path: 'veterinario/gestion-vacunas', 
        canActivate: [roleGuard],
        loadComponent: () => import('./features/vacunacion/pages/vacunacion/vacunacion.component')
          .then(m => m.VacunacionComponent),
        data: { titulo: 'Gestión de Vacunas', roles: ['VETERINARIO'] }
      },
      {
        path: 'veterinario/mi-agenda', 
        canActivate: [roleGuard],
        loadComponent: () => import('./features/agenda/pages/agenda/agenda.component')
          .then(m => m.AgendaComponent),
        data: { titulo: 'Mi agenda', roles: ['VETERINARIO'] }
      },
      {
        path: 'cliente/mis-citas', 
        canActivate: [roleGuard],
        loadComponent: () => import('./features/citas/pages/mis-citas/mis-citas.component')
          .then(m => m.MisCitasComponent),
        data: { titulo: 'Mis Citas', roles: ['CLIENTE'] }
      }
    ]
  },

  // =========================
  // RUTAS COMODÍN (Siempre al final)
  // =========================
  { path: '**', redirectTo: '404' }
];