import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, TemplateRef, ContentChild, ViewChild } from '@angular/core';

import { GithubAuthService } from '../services/github-auth.service';
import { LoadingViewService } from '../services/loading-view.service';

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
  loggedInSubscription: Subscription;

  activeLoginContent: TemplateRef<any>;
  activeLogoutContent: TemplateRef<any>;
  activeLoadingContent: TemplateRef<any>;
  activeTemplate: TemplateRef<any>;

  constructor(
    private githubService: GithubAuthService,
    private loadingViewService: LoadingViewService
  ) {
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

    this.loadingViewService.loadingView = this.activeLoadingContent;

    this.activeTemplate = this.githubService.isLoggedInSubject.getValue()
        ? this.activeLogoutContent
        : this.activeLoginContent;
    this.loggedInSubscription = this.githubService.isLoggedInSubject.subscribe(
      (isLoggedIn: boolean) => {
        this.activeTemplate = isLoggedIn
          ? this.activeLogoutContent
          : this.activeLoginContent;
      }
    )
  }

  ngOnDestroy(): void {
    this.loggedInSubscription.unsubscribe();
  }

  handleClick(event) {
    if(this.githubService.isLoggedInSubject.getValue()) {
      this.logout();
    }
    else {
      this.login();
    }
  }

  login() {
    this.githubService.login();
  }

  logout() {
    this.githubService.logOut();
  }

}
