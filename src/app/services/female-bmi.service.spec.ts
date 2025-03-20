import { TestBed } from '@angular/core/testing';

import { FemaleBmiService } from './female-bmi.service';

describe('FemaleBmiService', () => {
  let service: FemaleBmiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FemaleBmiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
