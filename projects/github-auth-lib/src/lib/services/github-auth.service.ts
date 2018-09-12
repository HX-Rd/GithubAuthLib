import { Injectable, Inject } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService, NgxStorageEvent } from 'ngx-store';
import { IClientConfig } from '../client-config.interface';
import { Router } from '@angular/router';

@Injectable()
export class GithubAuthService {
  public isLoggedInSubject = new BehaviorSubject<boolean>(this.storage.get('access_token') !== null);
  public accessTokenSubject = new BehaviorSubject<string>(this.storage.get('access_token'));
  public userInfoSubject = new BehaviorSubject<User>( this.storage.get('github_user_info') === null ? null : JSON.parse(this.storage.get('github_user_info')));
  constructor(
    @Inject('CLIENT_CONFIG') private config: IClientConfig,
    private router: Router,
    private storage: LocalStorageService,
  ) {
    this.storage.observe('access_token').pipe(
    ).subscribe(
      (event: NgxStorageEvent) => {
        this.isLoggedInSubject.next(true)
        this.accessTokenSubject.next(event.newValue as string);
      }
    );
    this.storage.observe('github_user_info').subscribe(
      (event: NgxStorageEvent) => {
        this.userInfoSubject.next(JSON.parse(event.newValue) as User);
      }
    )
  }

  login() {
    let url = `https://github.com/login/oauth/authorize`
      + `?response_type=id_token%20token`
      + `&client_id=${this.config.clientId}`
      + `&state=${this.generateRandomString(40)}`
      + `&redirect_uri=${this.config.redirectUrl}`
      + `&scope=${this.config.scopes.join('%20')}`
      + `&nonce=${this.generateRandomString(40)}`;
    window.open(url, '_self');
  }

  logOut() {
    this.isLoggedInSubject.next(false);
    this.accessTokenSubject.next(null);
    this.userInfoSubject.next(null);
    this.storage.remove('github_user_info');
    this.storage.remove('access_token');
    if (this.config.redirectAfterLogout) {
      this.router.navigate([this.config.redirectAfterLogout]);
    }
  }

  isLoggedIn(): boolean {
    return this.storage.get('access_token') !== null
  }

  getAccessToken(): string {
    return this.storage.get('access_token');
  }

  getUserInfo(): User {
    return JSON.parse(this.storage.get('github_user_info'));
  }

  private generateRandomString(length: number) : string {
    return Array.from(Array(length).keys()).map(() => { return (~~(Math.random()*36)).toString(36) }).join('');
  }
}

