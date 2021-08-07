import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { delay, takeUntil, finalize } from 'rxjs/operators';

import { ProductCreateModel, ProductUpdateModel } from './models/product.models';
import { ProductAllGQL } from './graphql/queries/__generated__/product-all.query.graphql.generated';
import { ProductFieldsFragment } from './graphql/fragments/__generated__/product.fragment.graphql.generated';
import { CreateProductGQL } from './graphql/mutations/__generated__/product-create.mutation.graphql.generated';
import { UpdateProductGQL } from './graphql/mutations/__generated__/product-update.mutation.graphql.generated';
import { DeleteProductGQL } from './graphql/mutations/__generated__/product-delete.mutation.graphql.generated';

@Injectable({
  providedIn: 'root',
})
export class ProductService implements OnDestroy {
  public productAll = new BehaviorSubject<ProductFieldsFragment[]>([]);
  public loading = new BehaviorSubject<boolean>(true);

  destroy$ = new Subject();

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private productAllGQL: ProductAllGQL,
    private createProductGQL: CreateProductGQL,
    private updateProductGQL: UpdateProductGQL,
    private deleteProductGQL: DeleteProductGQL
  ) {}

  getProductAll() {
    this.productAll.next([]);

    this.productAllGQL
      .fetch(undefined, {
        fetchPolicy: 'network-only',
      })
      .pipe(
        delay(2000),
        takeUntil(this.destroy$),
        finalize(() => this.loading.next(false))
      )
      .subscribe((result) => {
        const product: any =
          result.data && result.data.productAll
            ? result.data.productAll
            : ({} as any);

        this.productAll.next(product);
      });
  }

  createProduct(data: ProductCreateModel) {
    this.createProductGQL
      .mutate({
        data: {
          name: data.name,
          price: data.price,
          categoryId: Number(data.categoryId),
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.next(true))
      )
      .subscribe(
        () => {
          this.toastr.success('Produto cadastrado com sucesso!');
          this.router.navigate(['product/list']);
        },
        (ob: any) => {
          const obStringify = JSON.stringify(ob.networkError.error.errors);
          const obParsed = JSON.parse(obStringify);
          const obError = obParsed[0];
          this.toastr.error(obError.message);
        }
      );
  }

  updateProduct(data: ProductUpdateModel) {
    return;
  }

  deleteProduct(item: string) {
    this.deleteProductGQL
      .mutate({
        id: item,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          this.toastr.success('Produto removido com sucesso!.', 'Sucesso', {
            timeOut: 3000,
          });
        },
        (error) => {
          this.toastr.error('Falha ao remover Produto.', 'Falhou');
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
