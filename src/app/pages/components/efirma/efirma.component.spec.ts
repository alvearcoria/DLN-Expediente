import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfirmaComponent } from './efirma.component';

describe('EfirmaComponent', () => {
  let component: EfirmaComponent;
  let fixture: ComponentFixture<EfirmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EfirmaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EfirmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
