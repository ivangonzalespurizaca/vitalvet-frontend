import { Component, inject } from '@angular/core';
import { Router, ActivationEnd, RouterOutlet, ActivatedRoute } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  tituloActual = 'VITAL VET';
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      map(event => (event as ActivationEnd).snapshot.data['titulo']),
      startWith(this.obtenerTitulo())
    ).subscribe(titulo => {
      if (titulo) this.tituloActual = titulo;
    });
  }

  private obtenerTitulo(): string {
    if (!this.activatedRoute || !this.activatedRoute.firstChild) {
      return 'VITAL VET';
    }

    let route = this.activatedRoute.firstChild;
    
    while (route?.firstChild) {
      route = route.firstChild;
    }
    
    return route?.snapshot?.data?.['titulo'] || 'VITAL VET';
  }
}