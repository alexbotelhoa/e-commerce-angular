import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { TypeToForm } from './../../../../shared/types/type-to-form.type';
import { CategoryService } from 'src/app/modules/category/category.service';
import { ProductFieldsFragment } from '../../graphql/fragments/__generated__/product.fragment.graphql.generated';

export type ProductFormShape = {
  name: string;
  price: number;
  categoryId: number;
};

export type CategorySelect = {
  id: number;
  name: string;
};

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input()
  productId: ProductFieldsFragment[] = [];
  readonly productFormGroup: FormGroup;

  public categoryAll$ = this.categoryService.categoryAll.asObservable();
  public categoryAll: CategorySelect[] = [];

  public fieldCategoryId: string = '';

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

  ngOnChanges(changes: SimpleChanges): any {
    if (changes.productId) {
      if (this.productId) {
        const result = Object.values(this.productId);

        this.fieldCategoryId = String(result[3]);
        this.setFormValue({
          name: String(result[1]),
          price: Number(result[2]),
        });
      }
    }
  }

  getFormValue(): ProductFormShape {
    return this.productFormGroup.value;
  }

  setFormValue(value: Partial<ProductFormShape>) {
    this.productFormGroup.patchValue(value);
  }
}
