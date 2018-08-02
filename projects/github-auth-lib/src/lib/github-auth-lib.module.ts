import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';

import { LocalStorageModule } from 'angular-2-local-storage';
import { LocalStorageService } from 'angular-2-local-storage';

import { OAuthModule } from 'angular-oauth2-oidc';
import { ValidationHandler } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';
import { UrlHelperService } from 'angular-oauth2-oidc';

import { GithubAuthService } from './services/github-auth.service';
import { GithubAuthFactory } from './factories/injection-factories';
import { StorageBrigeFactory } from './factories/injection-factories';
import { StorageBrige } from './services/storage-bridge.service';

import { IClientConfig } from './client-config.interface';
import { LoginComponent } from './login/login.component';

import { CallbackComponent } from './callback/callback.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    OAuthModule,
    LocalStorageModule.withConfig({
      storageType: 'localStorage',
      prefix: '',
      notifyOptions: {
        setItem: true
      }
    })
  ],
  declarations: [
    LoginComponent,
    CallbackComponent
  ],
  entryComponents: [
    LoginComponent,
    CallbackComponent
  ],
  exports: [
    LoginComponent,
  ]
})
export class GithubAuthLibModule {
  static withConfig(clientConfig: IClientConfig): ModuleWithProviders {
    return {
      ngModule: GithubAuthLibModule,
      providers: [
        { provide: 'CLIENT_CONFIG', useValue: clientConfig},
        { provide: ValidationHandler, useClass: JwksValidationHandler },
        LocalStorageService,
        UrlHelperService,
        StorageBrige, {
          provide: StorageBrige,
          deps: [
            LocalStorageService
          ],
          useFactory: StorageBrigeFactory,
          multi: false
        },
        {
          provide: GithubAuthService,
          deps: [
            'CLIENT_CONFIG',
            Router,
            NgZone,
            HttpClient,
            StorageBrige,
            ValidationHandler,
            UrlHelperService
          ],
          useFactory: GithubAuthFactory,
          multi: false
        },

      ]
    };
  }
}

export { IClientConfig } from './client-config.interface';
export { GithubAuthService } from './services/github-auth.service';
export { LoginComponent } from './login/login.component';
