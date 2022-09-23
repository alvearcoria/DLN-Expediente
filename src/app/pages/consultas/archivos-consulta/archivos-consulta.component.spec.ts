import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosConsultaComponent } from './archivos-consulta.component';

describe('ArchivosConsultaComponent', () => {
  let component: ArchivosConsultaComponent;
  let fixture: ComponentFixture<ArchivosConsultaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivosConsultaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivosConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
