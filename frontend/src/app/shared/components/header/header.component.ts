import { Component, OnInit } from '@angular/core';

import { LoginModel } from '../../../modules/login/models/login.model';
import { AuthenticationService } from './../../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  currentUser: LoginModel | null = null;

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {}

  logout() {
    this.authenticationService.logout();
  }
}
