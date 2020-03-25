import { TestBed } from '@angular/core/testing';

import { FilterPersistenceService } from './filter-persistence-service.service';

describe('FilterPersistenceService', () => {
  let service: FilterPersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterPersistenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
