import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GithubAuthLibModule } from 'github-auth-lib';
import { SuccessComponent } from './success/success.component';

@NgModule({
  declarations: [
    AppComponent,
    SuccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GithubAuthLibModule.withConfig({
      clientId: '',
      redirectUrl: 'http://localhost:4200/authcallback',
      redirectAfterLogin: '/success',
      redirectAfterLogout: '/',
      codeRedirectUrl: '',
      scopes: ['user', 'repo']
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
