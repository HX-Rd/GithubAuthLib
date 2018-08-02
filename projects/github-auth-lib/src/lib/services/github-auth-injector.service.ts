import { Injectable, NgZone } from '@angular/core';
import { ValidationHandler, UrlHelperService } from 'angular-oauth2-oidc';
import { IClientConfig } from '../client-config.interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthConfig } from 'angular-oauth2-oidc';
import { CallbackComponent } from '../callback/callback.component';
import { StorageBrige } from './storage-bridge.service';
import { GithubAuthService } from './github-auth.service';

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
