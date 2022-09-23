import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccionesConsultaComponent } from './acciones-consulta.component';

describe('AccionesConsultaComponent', () => {
  let component: AccionesConsultaComponent;
  let fixture: ComponentFixture<AccionesConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccionesConsultaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccionesConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
