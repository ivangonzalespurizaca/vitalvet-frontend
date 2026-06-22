import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarConsultaComponent } from './registrar-consulta.component';

describe('RegistrarConsultaComponent', () => {
  let component: RegistrarConsultaComponent;
  let fixture: ComponentFixture<RegistrarConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarConsultaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
