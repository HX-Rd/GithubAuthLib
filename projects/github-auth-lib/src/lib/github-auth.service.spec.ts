import { TestBed, inject } from '@angular/core/testing';

import { GithubAuthService } from './github-auth.service';

describe('GithubAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GithubAuthService]
    });
  });

  it('should be created', inject([GithubAuthService], (service: GithubAuthService) => {
    expect(service).toBeTruthy();
  }));
});
