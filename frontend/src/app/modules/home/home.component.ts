import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import { LoginModel } from '../login/models/login.model';
import { LoginService } from '../../shared/services/login.service';
import { AuthenticationService } from './../../shared/services/authentication.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser: LoginModel | null = null;
  currentUserSubscription: Subscription;
  users: LoginModel[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private loginService: LoginService
  ) {
    this.currentUserSubscription =
      this.authenticationService.currentUser.subscribe((user) => {
        this.currentUser = user;
      });
  }

  ngOnInit(): void {
    this.loadLoginUsers();
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
  }

  deleteUser(id: number) {
    this.loginService
      .delete(id)
      .pipe(first())
      .subscribe(() => {
        this.loadLoginUsers();
      });
  }

  private loadLoginUsers() {
    this.loginService
      .getAll()
      .pipe(first())
      .subscribe((users) => {
        this.users = users;
      });
  }
}
