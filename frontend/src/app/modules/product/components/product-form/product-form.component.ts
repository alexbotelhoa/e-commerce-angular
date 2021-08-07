import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TypeToForm } from './../../../../shared/types/type-to-form.type';

export type ProductFormShape = {
  name: string;
  price: number;
  categoryId: number;
};

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  readonly productFormGroup: FormGroup;

  constructor() {
    const formConfig: TypeToForm<ProductFormShape> = {
      name: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      categoryId: new FormControl('', Validators.required),
    };

    this.productFormGroup = new FormGroup(formConfig);
  }

  ngOnInit(): void {}
}
