import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TypeToForm } from '../../../../shared/types/type-to-form.type';
import { LoginService } from '../../../../shared/services/login.service';
import { AlertService } from '../../../../shared/services/alert.service';
import { AuthenticationService } from '../../../../shared/services/authentication.service';

export type RegisterFormShape = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};

@Component({
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.css'],
})
export class RegisterComponent implements OnInit {
  readonly registerFormGroup: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private loginService: LoginService,
    private alertService: AlertService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }

    const formConfig: TypeToForm<RegisterFormShape> = {
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    };

    this.registerFormGroup = new FormGroup(formConfig);
  }

  ngOnInit(): void {}

  // convenience getter for easy access to form fields
  get f() {
    return this.registerFormGroup.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerFormGroup.invalid) {
      return;
    }

    this.loading = true;
    this.loginService
      .register(this.registerFormGroup.value)
      .pipe(first())
      .subscribe(
        (data) => {
          this.alertService.success('Registration successful', true);
          this.router.navigate(['/login']);
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }
}
