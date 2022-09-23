import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHisClinicaComponent } from './add-his-clinica.component';

describe('AddHisClinicaComponent', () => {
  let component: AddHisClinicaComponent;
  let fixture: ComponentFixture<AddHisClinicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHisClinicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHisClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
