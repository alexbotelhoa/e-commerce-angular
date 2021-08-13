import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../user.service';
import { UserUpdateModel } from '../../models/user.models';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserFieldsFragment } from '../../graphql/fragments/__generated__/user.fragment.graphql.generated';


@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css'],
})
export class UserUpdateComponent implements OnInit {

  @ViewChild(UserFormComponent)
  userForm: UserFormComponent | any = false;

  public loading: boolean = true;
  public loading$ = this.userService.loading.asObservable();
  
  public userId: UserFieldsFragment[] | null = null;
  public userId$ = this.userService.userId.asObservable();

  public selectedUserId: string = '';

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {
    this.userId$.subscribe((res) => (this.userId = res));
    this.loading$.subscribe((res) => (this.loading = res));
    this.activatedRoute.params.subscribe(
      (params) => (this.selectedUserId = params['id'])
    );
  }

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId() {
    this.userService.getUserId(this.selectedUserId);
  }

  sendForm() {
    const disabled = this.userForm?.userFormGroup.invalid;
    if (!disabled) {
      const data: UserUpdateModel = this.userForm?.userFormGroup.value;
      this.userService.updateUser(data, this.selectedUserId);
    }
  }
}
