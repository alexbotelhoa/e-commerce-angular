import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { CategoryFieldsFragment } from './graphql/fragments/__generated__/category.fragment.graphql.generated';
import { CategoryAllGQL } from './graphql/queries/__generated__/category-all.query.graphql.generated';

@Injectable({
  providedIn: 'root',
})
export class CategoryService implements OnDestroy {
  public categoryAll = new BehaviorSubject<CategoryFieldsFragment[]>([]);

  destroy$ = new Subject();

  constructor(private categoryAllGQL: CategoryAllGQL) {}

  getCategoryAll() {
    this.categoryAll.next([]);

    this.categoryAllGQL
      .fetch(undefined, {
        fetchPolicy: 'network-only',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        const category: any =
          result.data && result.data.categoryAll
            ? result.data.categoryAll
            : ({} as any);

        this.categoryAll.next(category);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
