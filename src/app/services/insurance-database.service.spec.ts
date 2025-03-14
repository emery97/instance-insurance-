import { TestBed } from '@angular/core/testing';

import { InsuranceDatabaseService } from './insurance-database.service';

describe('InsuranceDatabaseService', () => {
  let service: InsuranceDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsuranceDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
