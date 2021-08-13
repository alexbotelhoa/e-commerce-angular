import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TypeToForm } from './../../../../shared/types/type-to-form.type';
import { CategoryFieldsFragment } from '../../graphql/fragments/__generated__/category.fragment.graphql.generated';

export type CategoryFormShape = {
  name: string;
};

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit, OnChanges {
  readonly categoryFormGroup: FormGroup;

  @Input()
  categoryId: CategoryFieldsFragment[] | null = null;

  constructor() {
    const formConfig: TypeToForm<CategoryFormShape> = {
      name: new FormControl('', Validators.required),
    };

    this.categoryFormGroup = new FormGroup(formConfig);
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): any {
    if (changes.categoryId) {
      if (this.categoryId) {
        const result = Object.values(this.categoryId);

        this.setFormValue({
          name: result[1].toString(),
        });
      }
    }
  }

  getFormValue(): CategoryFormShape {
    return this.categoryFormGroup.value;
  }

  setFormValue(value: Partial<CategoryFormShape>) {
    this.categoryFormGroup.patchValue(value);
  }
}
