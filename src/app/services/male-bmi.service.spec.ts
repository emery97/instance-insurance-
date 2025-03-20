import { TestBed } from '@angular/core/testing';

import { MaleBmiService } from './male-bmi.service';

describe('MaleBmiService', () => {
  let service: MaleBmiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaleBmiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
