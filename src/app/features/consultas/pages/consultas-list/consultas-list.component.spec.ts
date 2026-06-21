import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultasListComponent } from './consultas-list.component';

describe('ConsultasListComponent', () => {
  let component: ConsultasListComponent;
  let fixture: ComponentFixture<ConsultasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultasListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
