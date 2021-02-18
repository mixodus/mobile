import { TestBed } from '@angular/core/testing';

import { HackathonRegistrationService } from './hackathon-registration.service';

describe('HackathonRegistrationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HackathonRegistrationService = TestBed.get(HackathonRegistrationService);
    expect(service).toBeTruthy();
  });
});
