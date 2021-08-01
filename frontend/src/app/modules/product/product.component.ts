import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductAllGQL } from './graphql/queries/__generated__/product-all.query.graphql.generated';
import { ProductFieldsFragment } from './graphql/fragments/__generated__/product.fragment.graphql.generated';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit, OnDestroy {
  productAll: ReadonlyArray<ProductFieldsFragment> = [];

  destroy$ = new Subject();

  constructor(private productAllGQL: ProductAllGQL) {}

  ngOnInit(): void {
    this.fetchProductAll();
  }

  fetchProductAll() {
    this.productAllGQL
      .fetch(undefined, {
        fetchPolicy: 'network-only',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result.data) {
          this.productAll = result.data.productAll;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
