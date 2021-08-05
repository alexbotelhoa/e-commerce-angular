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
  productAll$ = this.productService.productAll.asObservable();
  loading = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProductAll();
    this.productAll$.subscribe((res) => {
      this.productAll = res;
      if (res.length === 0 || res.length > 0) this.loading = false;
    });
  }

  getProductAll() {
    this.productService.getProductAll();
  }
}
