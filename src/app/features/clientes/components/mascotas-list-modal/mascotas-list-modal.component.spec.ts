import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotasListModalComponent } from './mascotas-list-modal.component';

describe('MascotasListModalComponent', () => {
  let component: MascotasListModalComponent;
  let fixture: ComponentFixture<MascotasListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotasListModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MascotasListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
