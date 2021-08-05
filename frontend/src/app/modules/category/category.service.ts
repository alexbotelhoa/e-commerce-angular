import { Injectable, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { CategoryAllGQL } from './graphql/queries/__generated__/category-all.query.graphql.generated';
import { CategoryFieldsFragment } from './graphql/fragments/__generated__/category.fragment.graphql.generated';
import { DeleteCategoryGQL } from './graphql/mutations/__generated__/category-delete.mutation.graphql.generated';

@Injectable({
  providedIn: 'root',
})
export class CategoryService implements OnDestroy {
  public categoryAll = new BehaviorSubject<CategoryFieldsFragment[]>([]);

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
      .pipe(delay(1000), takeUntil(this.destroy$))
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
      .pipe(delay(1000), takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          this.toastr.success('Categoria removida com sucesso!.', 'Sucesso', {
            timeOut: 3000,
          });
        },
        (error) => {
          this.toastr.error('Falha ao tentar remover a categoria.', 'Falha');
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
