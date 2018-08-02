import { GithubAuthService } from "../services/github-auth.service";
import { IClientConfig } from "../client-config.interface";
import { Router } from "@angular/router";
import { NgZone } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { StorageBrige } from "../services/storage-bridge.service";
import { ValidationHandler, UrlHelperService } from "angular-oauth2-oidc";
import { GithubAuthInjector } from "../services/github-auth-injector.service";
import { LocalStorageService } from "angular-2-local-storage";
import { LocalStorageBrigeInjector } from "../services/local-storage-brige-injector.service";

export function GithubAuthFactory(config: IClientConfig, router: Router, ngZone: NgZone, httpClient: HttpClient, storageBrige: StorageBrige, validationHandler: ValidationHandler, urlHelperService: UrlHelperService): GithubAuthService {
    return GithubAuthInjector.getInstance(config, router, ngZone, httpClient, storageBrige, validationHandler, urlHelperService);
}

export function StorageBrigeFactory(localStorageService: LocalStorageService): StorageBrige {
    return LocalStorageBrigeInjector.getInstance(localStorageService);
}
