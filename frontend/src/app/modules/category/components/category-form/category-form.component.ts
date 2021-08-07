import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TypeToForm } from './../../../../shared/types/type-to-form.type';

export type CategoryFormShape = {
  name: string;
};

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
})
export class CategoryFormComponent implements OnInit {
  readonly categoryFormGroup: FormGroup;

  constructor() {
    const formConfig: TypeToForm<CategoryFormShape> = {
      name: new FormControl('', Validators.required),
    };

    this.categoryFormGroup = new FormGroup(formConfig);
  }

  ngOnInit(): void {}
}
