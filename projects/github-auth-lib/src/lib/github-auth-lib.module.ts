import { NgModule } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

import { WebStorageModule } from 'ngx-store';
import { LocalStorageService } from 'ngx-store';

import { GithubAuthService } from './services/github-auth.service';
import { GithubAuthFactory } from './factories/injection-factories';

import { IClientConfig } from './client-config.interface';
import { LoginComponent } from './login/login.component';

import { CallbackComponent } from './callback/callback.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    WebStorageModule
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
        LocalStorageService,
        {
          provide: GithubAuthService,
          deps: [
            'CLIENT_CONFIG',
            Router,
            LocalStorageService
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
