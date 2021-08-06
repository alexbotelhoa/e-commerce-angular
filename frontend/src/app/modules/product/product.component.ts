import { ProductService } from './product.service';
import { Component, OnInit } from '@angular/core';

import { ProductFieldsFragment } from './graphql/fragments/__generated__/product.fragment.graphql.generated';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  productAll: ReadonlyArray<ProductFieldsFragment> = [];
  loading: boolean = true;

  productAll$ = this.productService.productAll.asObservable();
  loading$ = this.productService.loading.asObservable();

  constructor(private productService: ProductService) {
    this.productAll$.subscribe((res) => (this.productAll = res));
    this.loading$.subscribe((res) => (this.loading = res));
  }

  ngOnInit(): void {
    this.getProductAll();
  }

  getProductAll() {
    this.productService.getProductAll();
  }
}
