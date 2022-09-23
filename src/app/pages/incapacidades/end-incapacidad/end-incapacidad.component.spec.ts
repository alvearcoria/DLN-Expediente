import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndIncapacidadComponent } from './end-incapacidad.component';

describe('EndIncapacidadComponent', () => {
  let component: EndIncapacidadComponent;
  let fixture: ComponentFixture<EndIncapacidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EndIncapacidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
