import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddempleadoComponent } from './addempleado.component';

describe('AddempleadoComponent', () => {
  let component: AddempleadoComponent;
  let fixture: ComponentFixture<AddempleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddempleadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddempleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
