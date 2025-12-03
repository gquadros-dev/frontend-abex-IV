import { TestBed } from '@angular/core/testing';

import { Venda } from './venda.service';

describe('Venda', () => {
  let service: Venda;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Venda);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
