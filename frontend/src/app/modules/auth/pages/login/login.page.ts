import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TypeToForm } from './../../../../shared/types/type-to-form.type';
import { AlertService } from './../../../../shared/services/alert.service';
import { AuthenticationService } from './../../../../shared/services/authentication.service';

export type LoginFormShape = {
  username: string;
  password: string;
};

@Component({
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginComponent implements OnInit {
  readonly loginFormGroup: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }

    const formConfig: TypeToForm<LoginFormShape> = {
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    };

    this.loginFormGroup = new FormGroup(formConfig);
  }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginFormGroup.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginFormGroup.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate([this.returnUrl]);
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }

  getFormValue(): LoginFormShape {
    return this.loginFormGroup.value;
  }
}
