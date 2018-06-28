import { Component, OnInit } from '@angular/core';
import { GithubAuthService } from 'github-auth-lib';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  constructor(
    private githubAuth: GithubAuthService
  ) { }

  ngOnInit() {
    let token = this.githubAuth.getAccessToken();
    let x = 5;
  }

}
