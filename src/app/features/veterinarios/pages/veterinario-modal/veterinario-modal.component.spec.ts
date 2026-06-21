import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinarioModalComponent } from './veterinario-modal.component';

describe('VeterinarioModalComponent', () => {
  let component: VeterinarioModalComponent;
  let fixture: ComponentFixture<VeterinarioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeterinarioModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeterinarioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
