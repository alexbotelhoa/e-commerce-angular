import { Injectable, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { ProductAllGQL } from './graphql/queries/__generated__/product-all.query.graphql.generated';
import { ProductFieldsFragment } from './graphql/fragments/__generated__/product.fragment.graphql.generated';
import { DeleteProductGQL } from './graphql/mutations/__generated__/product-delete.mutation.graphql.generated';

@Injectable({
  providedIn: 'root',
})
export class ProductService implements OnDestroy {
  public productAll = new BehaviorSubject<ProductFieldsFragment[]>([]);

  destroy$ = new Subject();

  constructor(
    private toastr: ToastrService,
    private productAllGQL: ProductAllGQL,
    private deleteProductGQL: DeleteProductGQL
  ) {}

  getProductAll() {
    this.productAll.next([]);

    this.productAllGQL
      .fetch(undefined, {
        fetchPolicy: 'network-only',
      })
      .pipe(delay(1000), takeUntil(this.destroy$))
      .subscribe((result) => {
        const product: any =
          result.data && result.data.productAll
            ? result.data.productAll
            : ({} as any);

        this.productAll.next(product);
      });
  }

  deleteProduct(item: string) {
    this.deleteProductGQL
      .mutate({
        id: item,
      })
      .pipe(delay(1000), takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          this.toastr.success('Produto removido com sucesso!.', 'Sucesso', {
            timeOut: 3000,
          });
        },
        (error) => {
          this.toastr.error('Falha ao tentar remover produto.', 'Falha');
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
