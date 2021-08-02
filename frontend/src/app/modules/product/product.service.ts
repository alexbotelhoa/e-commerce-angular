import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { ProductFieldsFragment } from './graphql/fragments/__generated__/product.fragment.graphql.generated';
import { ProductAllGQL } from './graphql/queries/__generated__/product-all.query.graphql.generated';

@Injectable({
  providedIn: 'root',
})
export class ProductService implements OnDestroy {
  public productAll = new BehaviorSubject<ProductFieldsFragment[]>([]);

  destroy$ = new Subject();

  constructor(private productAllGQL: ProductAllGQL) {}

  getProductAll() {
    this.productAll.next([]);

    this.productAllGQL
      .fetch(undefined, {
        fetchPolicy: 'network-only',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        const product: any =
          result.data && result.data.productAll
            ? result.data.productAll
            : ({} as any);

        this.productAll.next(product);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
