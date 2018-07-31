import { LoginComponent } from './login/login.component';
import { Inject, Injectable, NgZone } from '@angular/core';
import { OAuthService, ValidationHandler, UrlHelperService } from 'angular-oauth2-oidc';
import { LocalStorageService } from 'angular-2-local-storage';
import { IClientConfig } from './client-config.interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthConfig } from 'angular-oauth2-oidc';
import { User } from './models/user.model';
import { CallbackComponent } from './callback/callback.component';

@Injectable()
export class StorageBrige implements Storage {
    length: number;
    constructor(private localStorageService: LocalStorageService) {
        this.length = localStorageService.length();
    }
    clear(): void {
        this.length = this.localStorageService.length();
        this.localStorageService.clearAll();
    }
    getItem(key: string): string | null {
        let ret = this.localStorageService.get(key);
        if (typeof ret === 'string') {
            return ret;
        }
        return null;
    }
    key(index: number): string | null {
        return this.localStorageService.keys()[index];
    }
    removeItem(key: string): void {
        this.length = this.localStorageService.length();
        this.localStorageService.remove(key);
    }
    setItem(key: string, data: string): void {
        this.length = this.localStorageService.length();
        this.localStorageService.set(key, data);
    }
    [key: string]: any;
    [index: number]: string;
}

@Injectable()
export class LocalStorageBrigeInjector {
    private static instance: StorageBrige = null;

    // Return the instance of the service
    public static getInstance(localStorageService: LocalStorageService): StorageBrige {
        if (LocalStorageBrigeInjector.instance === null) {
            LocalStorageBrigeInjector.instance = new StorageBrige(localStorageService);
        }
        return LocalStorageBrigeInjector.instance;
    }

    constructor(
        private localStorageService: LocalStorageService,
    ) { }
}

@Injectable()
export class GithubAuthInjector {
    private static instance: GithubAuthService = null;

    public static getInstance(config: IClientConfig, router: Router, ngZone: NgZone, httpClient: HttpClient, storageBrige: StorageBrige, validationHandler: ValidationHandler, urlHelperService: UrlHelperService): GithubAuthService {
        if (GithubAuthInjector.instance === null) {
            router.config.push(
                {
                    path: config.redirectUrl.split('/').pop(),
                    component: CallbackComponent
                }
            );
            router.resetConfig(router.config);

            let scopes = (config.scopes === undefined) ? 'user' : config.scopes;
            let authConfig = new AuthConfig();
            authConfig.oidc = true;
            authConfig.scope = scopes;
            authConfig.clientId = config.clientId;
            authConfig.redirectUri = config.redirectUrl;
            authConfig.loginUrl = 'https://github.com/login/oauth/authorize';

            GithubAuthInjector.instance = new GithubAuthService(ngZone, httpClient, storageBrige, validationHandler, authConfig, urlHelperService);

        }
        return GithubAuthInjector.instance;
    }
}

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

export function GithubAuthFactory(config: IClientConfig, router: Router, ngZone: NgZone, httpClient: HttpClient, storageBrige: StorageBrige, validationHandler: ValidationHandler, urlHelperService: UrlHelperService): GithubAuthService {
    return GithubAuthInjector.getInstance(config, router, ngZone, httpClient, storageBrige, validationHandler, urlHelperService);
}

export function StorageBrigeFactory(localStorageService: LocalStorageService): StorageBrige {
    return LocalStorageBrigeInjector.getInstance(localStorageService);
}
