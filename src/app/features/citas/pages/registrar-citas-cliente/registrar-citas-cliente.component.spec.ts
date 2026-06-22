import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarCitasClienteComponent } from './registrar-citas-cliente.component';

describe('RegistrarCitasClienteComponent', () => {
  let component: RegistrarCitasClienteComponent;
  let fixture: ComponentFixture<RegistrarCitasClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarCitasClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarCitasClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
