import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncapacidadComponent } from './add-incapacidad.component';

describe('AddIncapacidadComponent', () => {
  let component: AddIncapacidadComponent;
  let fixture: ComponentFixture<AddIncapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncapacidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
