import { LoginComponent } from './login/login.component';
import { Inject, Injectable, NgZone } from '@angular/core';
import { OAuthService, ValidationHandler, UrlHelperService } from 'angular-oauth2-oidc';
import { LocalStorageService } from 'angular-2-local-storage';
import { IClientConfig } from './client-config.interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthConfig } from 'angular-oauth2-oidc';

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
export class OAuthInjector {
    private static instance: OAuthService = null;

    // Return the instance of the service
    public static getInstance(config: IClientConfig, router: Router, ngZone: NgZone, httpClient: HttpClient, storageBrige: StorageBrige, validationHandler: ValidationHandler, urlHelperService: UrlHelperService): OAuthService {
        if (OAuthInjector.instance === null) {
            router.config.push(
                {
                    path: config.redirectUrl.split('/').pop(),
                    component: LoginComponent
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

            OAuthInjector.instance = new OAuthService(ngZone, httpClient, storageBrige, validationHandler, authConfig, urlHelperService);

        }
        return OAuthInjector.instance;
    }
}

@Injectable()
export class GithubAuthService extends OAuthService {
}

export function OAuthFactory(config: IClientConfig, router: Router, ngZone: NgZone, httpClient: HttpClient, storageBrige: StorageBrige, validationHandler: ValidationHandler, urlHelperService: UrlHelperService): OAuthService {
    return OAuthInjector.getInstance(config, router, ngZone, httpClient, storageBrige, validationHandler, urlHelperService);
}

export function StorageBrigeFactory(localStorageService: LocalStorageService): StorageBrige {
    return LocalStorageBrigeInjector.getInstance(localStorageService);
}