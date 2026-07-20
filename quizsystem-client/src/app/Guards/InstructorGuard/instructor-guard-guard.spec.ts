import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { instructorGuardGuard } from './instructor-guard-guard';

describe('instructorGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => instructorGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
