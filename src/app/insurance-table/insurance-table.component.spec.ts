import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceTableComponent } from './insurance-table.component';

describe('InsuranceTableComponent', () => {
  let component: InsuranceTableComponent;
  let fixture: ComponentFixture<InsuranceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsuranceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
