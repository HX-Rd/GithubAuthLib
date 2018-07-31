import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Component, OnInit, Inject, OnDestroy, TemplateRef, ContentChild, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { LocalStorageService } from 'angular-2-local-storage';

import { IClientConfig } from '../client-config.interface';
import { ILocalStorageEvent } from 'angular-2-local-storage/dist/local-storage-events.interface';
import { GithubAuthService } from '../github-auth.service';

@Component({
  selector: '[ga-login]',
  templateUrl: './login.component.html',
  host: {
    '(click)': "handleClick($event)"
  }
})
export class LoginComponent implements OnInit, OnDestroy {
  @ContentChild('login') loginContent: TemplateRef<any>;
  @ContentChild('logout') logoutContent: TemplateRef<any>;
  @ContentChild('loading') loadingContent: TemplateRef<any>;
  @ViewChild('defaultLogin') defaultLoginContent: TemplateRef<any>;
  @ViewChild('defaultLogout') defaultLogoutContent: TemplateRef<any>;
  @ViewChild('defaultLoading') defaultLoadingContent: TemplateRef<any>;

  redirectAfterLogout: string;
  accessTokenSubject: BehaviorSubject<boolean>;
  loggedInSubscription: Subscription;

  activeLoginContent: TemplateRef<any>;
  activeLogoutContent: TemplateRef<any>;
  activeLoadingContent: TemplateRef<any>;
  activeTemplate: TemplateRef<any>;

  constructor(
    @Inject('CLIENT_CONFIG') config: IClientConfig,
    private oauthService: GithubAuthService,
    private localStorageService: LocalStorageService,
    private router: Router,
  ) {
    this.redirectAfterLogout = config.redirectAfterLogout;
  }

  ngOnInit(): void {
    this.activeLoginContent = this.loginContent === undefined
      ? this.defaultLoginContent
      : this.loginContent;
    this.activeLogoutContent = this.logoutContent === undefined
      ? this.defaultLogoutContent
      : this.logoutContent;
    this.activeLoadingContent = this.loadingContent === undefined
      ? this.defaultLoadingContent
      : this.loadingContent;

    this.accessTokenSubject = new BehaviorSubject<boolean>(this.localStorageService.get('access_token') !== null);
    this.activeTemplate = this.accessTokenSubject.getValue()
        ? this.activeLogoutContent
        : this.activeLoginContent;
    this.loggedInSubscription = this.localStorageService.setItems$.pipe(
      filter((e: ILocalStorageEvent) => e.key === 'access_token'),
      map((e: ILocalStorageEvent) => e.newvalue)
    ).subscribe(() => {
      this.activeTemplate = this.activeLogoutContent;
      return this.accessTokenSubject.next(true)
    });
  }

  ngOnDestroy(): void {
    this.accessTokenSubject.unsubscribe();
    this.loggedInSubscription.unsubscribe();
  }

  handleClick(event) {
    if(this.accessTokenSubject.getValue()) {
      this.logout();
    }
    else {
      this.login();
    }
  }

  login() {
    this.oauthService.startImplicitFlow();
  }

  logout() {
    this.oauthService.logOut();
    this.activeTemplate = this.activeLoginContent;
    this.accessTokenSubject.next(false);
    if (this.redirectAfterLogout) {
      this.router.navigate([this.redirectAfterLogout]);
    }
  }
}
