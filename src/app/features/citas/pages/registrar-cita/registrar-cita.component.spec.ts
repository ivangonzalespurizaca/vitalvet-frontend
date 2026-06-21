import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarCitaComponent } from './registrar-cita.component';

describe('RegistrarCitaComponent', () => {
  let component: RegistrarCitaComponent;
  let fixture: ComponentFixture<RegistrarCitaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarCitaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
