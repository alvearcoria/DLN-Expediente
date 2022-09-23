import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionIncapacidadComponent } from './action-incapacidad.component';

describe('ActionIncapacidadComponent', () => {
  let component: ActionIncapacidadComponent;
  let fixture: ComponentFixture<ActionIncapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionIncapacidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
