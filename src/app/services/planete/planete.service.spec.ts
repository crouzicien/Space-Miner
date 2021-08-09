import { TestBed } from '@angular/core/testing';

import { PlaneteService } from './planete.service';

describe('PlaneteService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlaneteService = TestBed.get(PlaneteService);
    expect(service).toBeTruthy();
  });
});
