import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIncapacidadComponent } from './modal-incapacidad.component';

describe('ModalIncapacidadComponent', () => {
  let component: ModalIncapacidadComponent;
  let fixture: ComponentFixture<ModalIncapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalIncapacidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
