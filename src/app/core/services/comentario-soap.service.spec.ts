import { TestBed } from '@angular/core/testing';

import { ComentarioSoapService } from './comentario-soap.service';

describe('ComentarioSoapService', () => {
  let service: ComentarioSoapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComentarioSoapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
