import { Component, OnInit, AfterViewInit, Inject, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from 'angular-2-local-storage';
import { User } from '../models/user.model';
import { IClientConfig } from '../client-config.interface';
import { LoadingViewService } from '../loading-view.service';

@Component({
  selector: 'ga-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
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
    private localStorageService: LocalStorageService,
    private router: Router,
    private loadingViewService: LoadingViewService
  ) {
    this.redirectAfterLogin = (config.redirectAfterLogin === undefined) ? '/' : config.redirectAfterLogin;
    this.codeRedirectUrl = config.codeRedirectUrl;
   }

  ngOnInit() {
    this.loadingTemplate = this.loadingViewService.loadingView;
  }

  ngAfterViewInit(): void {
    this.redirectSubscription = this.activatedRoute.queryParams.pipe(
      filter((params: Params) => { console.log(params); return params['code'] !== undefined }),
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
    )
  }
}
