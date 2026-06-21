import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinariosListComponent } from './veterinarios-list.component';

describe('VeterinariosListComponent', () => {
  let component: VeterinariosListComponent;
  let fixture: ComponentFixture<VeterinariosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeterinariosListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeterinariosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
