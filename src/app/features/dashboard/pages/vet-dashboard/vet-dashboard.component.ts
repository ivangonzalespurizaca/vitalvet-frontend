import { Component, inject, OnInit } from '@angular/core';
import { AuthService, CustomJwtPayload } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-vet-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './vet-dashboard.component.html',
  styleUrl: './vet-dashboard.component.css'
})
export class VetDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  perfil: CustomJwtPayload | null = null;

  ngOnInit(): void {
    this.perfil = this.authService.getUserProfile();
  }

  onLogout(): void {
    this.authService.logout();
    window.location.reload();
  }
}