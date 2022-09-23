import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsubempresaComponent } from './addsubempresa.component';

describe('AddsubempresaComponent', () => {
  let component: AddsubempresaComponent;
  let fixture: ComponentFixture<AddsubempresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddsubempresaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsubempresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
