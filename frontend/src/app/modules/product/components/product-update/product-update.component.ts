import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProductService } from '../../product.service';
import { ProductUpdateModel } from '../../models/product.models';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductFieldsFragment } from '../../graphql/fragments/__generated__/product.fragment.graphql.generated';


@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css'],
})
export class ProductUpdateComponent implements OnInit {

  @ViewChild(ProductFormComponent)
  productForm: ProductFormComponent | any = false;

  public loading: boolean = true;
  public loading$ = this.productService.loading.asObservable();

  public productId: ProductFieldsFragment[] | null = null;
  public productId$ = this.productService.productId.asObservable();

  public selectedProductId: string = '';

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute
  ) {
    this.productId$.subscribe((res) => (this.productId = res));
    this.loading$.subscribe((res) => (this.loading = res));
    this.activatedRoute.params.subscribe(
      (params) => (this.selectedProductId = params['id'])
    );
  }

  ngOnInit(): void {
    this.getProductId();
  }

  getProductId() {
    this.productService.getProductId(this.selectedProductId);
  }

  sendForm() {
    const disabled = this.productForm?.productFormGroup.invalid;
    if (!disabled) {
      const data: ProductUpdateModel = this.productForm?.productFormGroup.value;
      this.productService.updateProduct(data, this.selectedProductId);
    }
  }
}
