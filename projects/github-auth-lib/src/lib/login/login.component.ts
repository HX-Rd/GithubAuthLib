import { BehaviorSubject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Component, OnInit, Inject, OnDestroy, TemplateRef, ContentChild, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { IClientConfig } from '../client-config.interface';
import { GithubAuthService } from '../services/github-auth.service';
import { LoadingViewService } from '../services/loading-view.service';

@Component({
  selector: '[ga-login]',
  templateUrl: './login.component.html',
  host: {
    '(click)': "handleClick($event)"
  },
  encapsulation: ViewEncapsulation.None
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
    @Inject('CLIENT_CONFIG') config: IClientConfig,
    private githubService: GithubAuthService,
    private router: Router,
    private loadingViewService: LoadingViewService
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

    this.loadingViewService.loadingView = this.activeLoadingContent;

    this.activeTemplate = this.githubService.isLoggedInSubject().getValue()
        ? this.activeLogoutContent
        : this.activeLoginContent;
    this.loggedInSubscription = this.githubService.isLoggedInSubject().subscribe(
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
    if(this.githubService.isLoggedInSubject().getValue()) {
      this.logout();
    }
    else {
      this.login();
    }
  }

  login() {
    this.githubService.startImplicitFlow();
  }

  logout() {
    this.githubService.logOut();
    if (this.redirectAfterLogout) {
      this.router.navigate([this.redirectAfterLogout]);
    }
  }
}
