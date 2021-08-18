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
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.loginFormGroup.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginFormGroup.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        (data) => {
          // this.router.navigate([this.returnUrl]);
          this.router.navigate(['..']);
        },
        (error) => {
          console.log('deu ruim');
          this.alertService.error(error);
          this.loading = false;
        }
      );
  }

  getFormValue(): LoginFormShape {
    return this.loginFormGroup.value;
  }
}
