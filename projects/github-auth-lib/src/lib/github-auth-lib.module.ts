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
import { OAuthService } from 'angular-oauth2-oidc';
import { ValidationHandler } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';
import { UrlHelperService } from 'angular-oauth2-oidc';

import { OAuthFactory } from './github-auth.service';
import { StorageBrigeFactory } from './github-auth.service';
import { StorageBrige } from './github-auth.service';

import { IClientConfig } from './client-config.interface';
import { LoginComponent } from './login/login.component';

import { GithubAuthService } from './github-auth.service';

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
    LoginComponent
  ],
  entryComponents: [
    LoginComponent
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

        OAuthService, {
          provide: OAuthService,
          deps: [
            'CLIENT_CONFIG',
            Router,
            NgZone,
            HttpClient,
            StorageBrige,
            ValidationHandler,
            UrlHelperService
          ],
          useFactory: OAuthFactory,
          multi: false
        },
        { provide: GithubAuthService, useExisting: OAuthService }
      ]
    };
  }
}

export { IClientConfig } from './client-config.interface';
export { GithubAuthService } from './github-auth.service';
export { LoginComponent } from './login/login.component';