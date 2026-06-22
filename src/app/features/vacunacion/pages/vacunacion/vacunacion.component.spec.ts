import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacunacionComponent } from './vacunacion.component';

describe('VacunacionComponent', () => {
  let component: VacunacionComponent;
  let fixture: ComponentFixture<VacunacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VacunacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacunacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
