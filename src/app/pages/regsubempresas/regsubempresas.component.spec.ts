import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegsubempresasComponent } from './regsubempresas.component';

describe('RegsubempresasComponent', () => {
  let component: RegsubempresasComponent;
  let fixture: ComponentFixture<RegsubempresasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegsubempresasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegsubempresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
