import { Component, OnInit, AfterViewInit, Inject, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, switchMap, mergeMap, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user.model';
import { IClientConfig } from '../client-config.interface';
import { LoadingViewService } from '../services/loading-view.service';
import { GithubAuthService } from '../services/github-auth.service';
import { LocalStorageService } from 'ngx-store';

@Component({
  selector: 'ga-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CallbackComponent implements OnInit, AfterViewInit {
  redirectAfterLogin: string;
  redirectSubscription: Subscription;
  getCodeSubscription: Subscription;
  codeRedirectUrl: string;
  loadingTemplate: TemplateRef<any>;

  constructor(
    @Inject('CLIENT_CONFIG') config: IClientConfig,
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loadingViewService: LoadingViewService,
    private localStorageService: LocalStorageService
  ) {
    this.redirectAfterLogin = (config.redirectAfterLogin === undefined) ? '/' : config.redirectAfterLogin;
    this.codeRedirectUrl = config.codeRedirectUrl;
   }

  ngOnInit() {
    this.loadingTemplate = this.loadingViewService.loadingView;
  }

  ngAfterViewInit(): void {
    this.redirectSubscription = this.activatedRoute.queryParams.pipe(
      filter((params: Params) => { return params['code'] !== undefined }),
      map((params: Params) => params['code']),
      switchMap((code: string) => {
        return this.httpClient.get(this.codeRedirectUrl + '/' + code, { responseType: 'text'}).pipe(
          map((response) => JSON.parse(response).token),
          switchMap((access_token: string) => {
            this.localStorageService.set('access_token', access_token);
            const options = {
              headers: new HttpHeaders({
                'Authorization': `Bearer ${access_token}`
              })
            }
            return this.httpClient.get<User>('https://api.github.com/user', options)
          })
        )
      })
    ).subscribe(
      (user: User) => {
        this.localStorageService.set('github_user_info', JSON.stringify(user));
        this.router.navigate([this.redirectAfterLogin]);
      }
    )


    /*.subscribe(
      (code: string) => {
        this.getCodeSubscription = this.httpClient.get(this.codeRedirectUrl + '/' + code, { responseType: 'text'}).pipe(
          map((response) => JSON.parse(response).token)
        ).subscribe(
          (access_token: string) => {
            this.localStorageService.set('access_token', access_token);
            const options = {
              headers: new HttpHeaders({
                'Authorization': `Bearer ${access_token}`
              })
            }
            this.httpClient.get<User>('https://api.github.com/user', options)
            .subscribe(
              (user: User) => {
                this.localStorageService.set('github_user_info', JSON.stringify(user));
                this.router.navigate([this.redirectAfterLogin]);
              }
            );
          }
        )
      }
    )*/



    /*this.redirectSubscription = this.activatedRoute.queryParams.pipe(
      filter((params: Params) => { return params['code'] !== undefined }),
      map((params: Params) => params['code'])
    )
    .subscribe(
      (code: string) => {
        this.getCodeSubscription = this.httpClient.get(this.codeRedirectUrl + '/' + code, { responseType: 'text'}).pipe(
          map((response) => JSON.parse(response).token)
        ).subscribe(
          (access_token: string) => {
            this.localStorageService.set('access_token', access_token);
            const options = {
              headers: new HttpHeaders({
                'Authorization': `Bearer ${access_token}`
              })
            }
            this.httpClient.get<User>('https://api.github.com/user', options)
            .subscribe(
              (user: User) => {
                this.localStorageService.set('github_user_info', JSON.stringify(user));
                this.router.navigate([this.redirectAfterLogin]);
              }
            );
          }
        )
      }
    )*/
  }
}
