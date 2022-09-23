import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExamenMedicoComponent } from './add-examen-medico.component';

describe('AddExamenMedicoComponent', () => {
  let component: AddExamenMedicoComponent;
  let fixture: ComponentFixture<AddExamenMedicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExamenMedicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExamenMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
