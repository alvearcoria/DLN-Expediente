import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesIncapacidadComponent } from './detalles-incapacidad.component';

describe('DetallesIncapacidadComponent', () => {
  let component: DetallesIncapacidadComponent;
  let fixture: ComponentFixture<DetallesIncapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesIncapacidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
