import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TypeToForm } from './../../../../shared/types/type-to-form.type';
import { UserFieldsFragment } from './../../graphql/fragments/__generated__/user.fragment.graphql.generated';

export type UserFormShape = {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  level: string;
  hasActive: boolean;
};

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input()
  userId: UserFieldsFragment[] | null = null;

  readonly userFormGroup: FormGroup;
  public selectedLevel: string = '';
  public checkedHasActive: boolean = false;

  myModel = true;

  constructor() {
    const formConfig: TypeToForm<UserFormShape> = {
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      cpf: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      level: new FormControl('', Validators.required),
      hasActive: new FormControl(false, Validators.required),
    };

    this.userFormGroup = new FormGroup(formConfig);
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): any {
    if (changes.userId) {
      if (this.userId) {
        const result = Object.values(this.userId);

        this.selectedLevel = String(result[5]);
        this.checkedHasActive = Boolean(result[6]);

        this.setFormValue({
          name: String(result[1]),
          email: String(result[2]),
          cpf: String(result[3]),
          phone: String(result[4]),
          level: String(result[5]),
          hasActive: Boolean(result[6]),
        });
      }
    }
  }

  getFormValue(): UserFormShape {
    return this.userFormGroup.value;
  }

  setFormValue(value: Partial<UserFormShape>) {
    this.userFormGroup.patchValue(value);
  }
}
