import { TestBed } from '@angular/core/testing';

import { AvgBmiService } from './avg-bmi.service';

describe('AvgBmiService', () => {
  let service: AvgBmiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvgBmiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
