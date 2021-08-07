import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TypeToForm } from './../../../../shared/types/type-to-form.type';

export type UserFormShape = {
  name: string;
  email: string;
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  readonly userFormGroup: FormGroup;

  constructor() {
    const formConfig: TypeToForm<UserFormShape> = {
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    };

    this.userFormGroup = new FormGroup(formConfig);
  }

  ngOnInit(): void {}

  // getFormValue(): UserFormShape {
  //   return this.userFormGroup.value;
  // }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.user) {
  //     if (this.user) {
  //       this.setFormValue({
  //         name: this.user.name,
  //         email: this.user.description,
  //       });
  //     }
  //   }
  // }

  // setFormValue(value: Partial<UserFormShape>) {
  //   this.userFormGroup.patchValue(value);
  // }
}
