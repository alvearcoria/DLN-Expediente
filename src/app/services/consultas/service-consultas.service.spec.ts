import { TestBed } from '@angular/core/testing';

import { ServiceConsultasService } from './service-consultas.service';

describe('ServiceConsultasService', () => {
  let service: ServiceConsultasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceConsultasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
