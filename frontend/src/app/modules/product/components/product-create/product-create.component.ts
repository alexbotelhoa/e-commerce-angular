import { Component, OnInit, ViewChild } from '@angular/core';

import { ProductService } from '../../product.service';
import { ProductCreateModel } from '../../models/product.models';
import { ProductFormComponent } from '../product-form/product-form.component';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css'],
})
export class ProductCreateComponent implements OnInit {
  @ViewChild(ProductFormComponent)
  productForm: ProductFormComponent | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {}

  sendForm() {
    const disabled = this.productForm?.productFormGroup.invalid;
    if (!disabled) {
      const data: ProductCreateModel = this.productForm?.productFormGroup.value;
      this.productService.createProduct(data);
    }
  }
}
