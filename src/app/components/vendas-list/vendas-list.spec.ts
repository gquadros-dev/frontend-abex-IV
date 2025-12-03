import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendasList } from './vendas-list';

describe('VendasList', () => {
  let component: VendasList;
  let fixture: ComponentFixture<VendasList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendasList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendasList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
