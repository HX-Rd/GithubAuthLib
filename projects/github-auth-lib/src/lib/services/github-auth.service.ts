import { Injectable, NgZone } from '@angular/core';
import { OAuthService, ValidationHandler, UrlHelperService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { AuthConfig } from 'angular-oauth2-oidc';
import { User } from '../models/user.model';
import { StorageBrige } from './storage-bridge.service';

@Injectable()
export class GithubAuthService {
  private oauthService: OAuthService;
  constructor(
    private ngZone: NgZone,
    private httpClient: HttpClient,
    private storageBrige: StorageBrige,
    private validationHandler: ValidationHandler,
    private authConfig: AuthConfig,
    private urlHelperService: UrlHelperService,
  ) {
    this.oauthService = new OAuthService(ngZone, httpClient, storageBrige, validationHandler, authConfig, urlHelperService);
  }

  startImplicitFlow() {
    this.oauthService.initImplicitFlow();
  }

  logOut() {
    this.oauthService.logOut();
    this.storageBrige.removeItem('github_user_info');
  }

  getAccessToken(): string {
    let tokenRaw = this.oauthService.getAccessToken();
    if(tokenRaw !== undefined) {
      let token = tokenRaw.replace(/\"/g, '');
      return token;
    }
  }

  getUserInfo(): User {
    return JSON.parse(this.storageBrige.getItem('github_user_info'));
  }
}

