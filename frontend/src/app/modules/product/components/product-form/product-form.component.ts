import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/modules/category/category.service';
import { getEnabledCategories } from 'trace_events';

import { TypeToForm } from './../../../../shared/types/type-to-form.type';

export type ProductFormShape = {
  name: string;
  price: number;
  categoryId: number;
};

export type CategorySelect = {
  id: number;
  name: string;
}

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit {
  readonly productFormGroup: FormGroup;

  categoryAll$ = this.categoryService.categoryAll.asObservable();
  categoryAll: CategorySelect[] = [];

  constructor(private categoryService: CategoryService) {
    const formConfig: TypeToForm<ProductFormShape> = {
      name: new FormControl('', Validators.required),
      price: new FormControl(0, Validators.required),
      categoryId: new FormControl([], Validators.required),
    };
    this.productFormGroup = new FormGroup(formConfig);

    this.categoryAll$.subscribe((res: any) => (this.categoryAll = res));
  }

  ngOnInit(): void {
    this.getCategoryAll();
  }

  getCategoryAll() {
    this.categoryService.getCategoryAll();
  }
}
