import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {}

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }
}
