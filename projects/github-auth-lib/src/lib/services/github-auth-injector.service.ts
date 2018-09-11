import { Injectable } from '@angular/core';
import { IClientConfig } from '../client-config.interface';
import { Router } from '@angular/router';
import { CallbackComponent } from '../callback/callback.component';
import { GithubAuthService } from './github-auth.service';
import { LocalStorageService } from 'ngx-store';

@Injectable()
export class GithubAuthInjector {
    private static instance: GithubAuthService = null;

    public static getInstance(config: IClientConfig, router: Router, storage: LocalStorageService): GithubAuthService {
        if (GithubAuthInjector.instance === null) {
            router.config.unshift(
                {
                    path: config.redirectUrl.split('/').pop(),
                    component: CallbackComponent
                }
            );
            router.resetConfig(router.config);
            GithubAuthInjector.instance = new GithubAuthService(config, router, storage);
        }
        return GithubAuthInjector.instance;
    }
}
