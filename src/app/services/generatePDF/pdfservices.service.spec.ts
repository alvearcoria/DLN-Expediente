import { TestBed } from '@angular/core/testing';

import { PdfservicesService } from './pdfservices.service';

describe('PdfservicesService', () => {
  let service: PdfservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
