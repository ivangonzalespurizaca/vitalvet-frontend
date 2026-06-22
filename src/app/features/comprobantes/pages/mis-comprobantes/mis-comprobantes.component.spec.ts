import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisComprobantesComponent } from './mis-comprobantes.component';

describe('MisComprobantesComponent', () => {
  let component: MisComprobantesComponent;
  let fixture: ComponentFixture<MisComprobantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisComprobantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisComprobantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
