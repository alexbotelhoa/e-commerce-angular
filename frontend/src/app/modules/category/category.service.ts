import { Injectable, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { delay, takeUntil, finalize } from 'rxjs/operators';
import { CategoryAllGQL } from './graphql/queries/__generated__/category-all.query.graphql.generated';
import { CategoryFieldsFragment } from './graphql/fragments/__generated__/category.fragment.graphql.generated';
import { DeleteCategoryGQL } from './graphql/mutations/__generated__/category-delete.mutation.graphql.generated';

@Injectable({
  providedIn: 'root',
})
export class CategoryService implements OnDestroy {
  public categoryAll = new BehaviorSubject<CategoryFieldsFragment[]>([]);
  public loading = new BehaviorSubject<boolean>(true);

  destroy$ = new Subject();

  constructor(
    private toastr: ToastrService,
    private categoryAllGQL: CategoryAllGQL,
    private deleteCategoryGQL: DeleteCategoryGQL
  ) {}

  getCategoryAll() {
    this.categoryAll.next([]);

    this.categoryAllGQL
      .fetch(undefined, {
        fetchPolicy: 'network-only',
      })
      .pipe(
        delay(2000),
        takeUntil(this.destroy$),
        finalize(() => this.loading.next(false))
      )
      .subscribe((result) => {
        const category: any =
          result.data && result.data.categoryAll
            ? result.data.categoryAll
            : ({} as any);

        this.categoryAll.next(category);
      });
  }

  deleteCategory(item: string) {
    this.deleteCategoryGQL
      .mutate({
        id: item,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          this.toastr.success('Categoria removida com sucesso!.', 'Sucesso', {
            timeOut: 3000,
          });
        },
        (error) => {
          this.toastr.error('Falha ao tentar remover a categoria.', 'Falhou');
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
