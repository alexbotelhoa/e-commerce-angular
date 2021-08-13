import { Component, OnInit } from '@angular/core';

import { ProductService } from './product.service';
import { ProductFieldsFragment } from './graphql/fragments/__generated__/product.fragment.graphql.generated';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  public loading: boolean = true;
  public loading$ = this.productService.loading.asObservable();

  public productAll: ReadonlyArray<ProductFieldsFragment> = [];
  public productAll$ = this.productService.productAll.asObservable();

  constructor(private productService: ProductService) {
    this.loading$.subscribe((res) => (this.loading = res));
    this.productAll$.subscribe((res) => (this.productAll = res));
  }

  ngOnInit(): void {
    this.getProductAll();
  }

  getProductAll() {
    this.productService.getProductAll();
  }
}
