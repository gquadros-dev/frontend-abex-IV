import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fornecedorformcomponent } from './fornecedorformcomponent';

describe('Fornecedorformcomponent', () => {
  let component: Fornecedorformcomponent;
  let fixture: ComponentFixture<Fornecedorformcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fornecedorformcomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fornecedorformcomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
