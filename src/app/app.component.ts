import { Component } from '@angular/core';
import { GithubAuthService } from 'github-auth-lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private githubAuth: GithubAuthService
  ) {
  }

  title = 'app';
}
