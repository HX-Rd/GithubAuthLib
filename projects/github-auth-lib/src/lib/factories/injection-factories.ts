import { GithubAuthService } from "../services/github-auth.service";
import { IClientConfig } from "../client-config.interface";
import { Router } from "@angular/router";
import { GithubAuthInjector } from "../services/github-auth-injector.service";
import { LocalStorageService } from "ngx-store";

export function GithubAuthFactory(config: IClientConfig, router: Router, storage: LocalStorageService): GithubAuthService {
    return GithubAuthInjector.getInstance(config, router, storage);
}
