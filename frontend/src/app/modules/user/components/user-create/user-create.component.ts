import { Component, OnInit, ViewChild } from '@angular/core';

import { UserService } from '../../user.service';
import { UserCreateModel } from '../../models/user.models';
import { UserFormComponent } from '../user-form/user-form.component';


@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
})
export class UserCreateComponent implements OnInit {
  @ViewChild(UserFormComponent)
  userForm: UserFormComponent | any = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  sendForm() {
    const disabled = this.userForm?.userFormGroup.invalid;
    if (!disabled) {
      const data: UserCreateModel = this.userForm?.userFormGroup.value;
      this.userService.createUser(data);
    }
  }
}
