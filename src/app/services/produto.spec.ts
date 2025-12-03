import { TestBed } from '@angular/core/testing';

import { Produto } from '../models/produto';

describe('Produto', () => {
  let service: Produto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Produto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
