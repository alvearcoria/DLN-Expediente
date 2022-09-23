import { TestBed } from '@angular/core/testing';

import { ServicesExamenesMedicosService } from './services-examenes-medicos.service';

describe('ServicesExamenesMedicosService', () => {
  let service: ServicesExamenesMedicosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesExamenesMedicosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
