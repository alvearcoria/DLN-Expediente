import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConsultasComponent } from './modal-consultas.component';

describe('ModalConsultasComponent', () => {
  let component: ModalConsultasComponent;
  let fixture: ComponentFixture<ModalConsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalConsultasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
