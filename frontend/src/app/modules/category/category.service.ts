import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { delay, takeUntil, finalize } from 'rxjs/operators';

import { CategoryCreateModel, CategoryUpdateModel } from './models/category.model';
import { CategoryAllGQL } from './graphql/queries/__generated__/category-all.query.graphql.generated';
import { CategoryByIdGQL } from './graphql/queries/__generated__/category-id.query.graphql.generated';
import { CategoryFieldsFragment } from './graphql/fragments/__generated__/category.fragment.graphql.generated';
import { CreateCategoryGQL } from './graphql/mutations/__generated__/category-create.mutation.graphql.generated';
import { UpdateCategoryGQL } from './graphql/mutations/__generated__/category-update.mutation.graphql.generated';
import { DeleteCategoryGQL } from './graphql/mutations/__generated__/category-delete.mutation.graphql.generated';

@Injectable({
  providedIn: 'root',
})
export class CategoryService implements OnDestroy {
  public destroy$ = new Subject();

  public loading = new BehaviorSubject<boolean>(true);
  public categoryAll = new BehaviorSubject<CategoryFieldsFragment[]>([]);
  public categoryId = new BehaviorSubject<CategoryFieldsFragment[]>([]);

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private categoryAllGQL: CategoryAllGQL,
    private categoryByIdGQL: CategoryByIdGQL,
    private createCategoryGQL: CreateCategoryGQL,
    private updateCategoryGQL: UpdateCategoryGQL,
    private deleteCategoryGQL: DeleteCategoryGQL
  ) {}

  getCategoryAll() {
    this.categoryAllGQL
      .fetch(undefined, {
        fetchPolicy: 'network-only',
      })
      .pipe(
        delay(1000),
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

  getCategoryId(item: string) {
    this.categoryByIdGQL
      .fetch(
        {
          id: item,
        },
        {
          fetchPolicy: 'network-only',
        }
      )
      .pipe(
        delay(1000),
        takeUntil(this.destroy$),
        finalize(() => this.loading.next(false))
      )
      .subscribe((result) => {
        const category: any =
          result.data && result.data.categoryById
            ? result.data.categoryById
            : ({} as any);

        this.categoryId.next(category);
      });
  }

  createCategory(data: CategoryCreateModel) {
    this.createCategoryGQL
      .mutate({
        data: {
          name: data.name,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.next(true))
      )
      .subscribe(
        () => {
          this.toastr.success('Categoria cadastrada com sucesso!');
          this.router.navigate(['category/list']);
        },
        (ob: any) => {
          const obStringify = JSON.stringify(ob.networkError.error.errors);
          const obParsed = JSON.parse(obStringify);
          const obError = obParsed[0];
          this.toastr.error(obError.message);
        }
      );
  }

  updateCategory(data: CategoryUpdateModel, id: string) {
    this.updateCategoryGQL
      .mutate({
        data: {
          id: id,
          name: data.name,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.next(true))
      )
      .subscribe(
        () => {
          this.toastr.success('Categoria atualizada com sucesso!');
          this.router.navigate(['category/list']);
        },
        (ob: any) => {
          const obStringify = JSON.stringify(ob.networkError.error.errors);
          const obParsed = JSON.parse(obStringify);
          const obError = obParsed[0];
          this.toastr.error(obError.message);
        }
      );
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
          this.toastr.error('Falha ao remover a Categoria.', 'Falhou');
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
