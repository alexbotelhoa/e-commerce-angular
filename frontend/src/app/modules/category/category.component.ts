import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoryAllGQL } from './graphql/queries/__generated__/category-all.query.graphql.generated';
import { CategoryFieldsFragment } from './graphql/fragments/__generated__/category.fragment.graphql.generated';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  categoryAll: ReadonlyArray<CategoryFieldsFragment> = [];

  destroy$ = new Subject();

  constructor(private categoryAllGQL: CategoryAllGQL) {}

  ngOnInit(): void {
    this.fetchCategoryAll();
  }

  fetchCategoryAll() {
    this.categoryAllGQL
      .fetch(undefined, {
        fetchPolicy: 'network-only',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result.data) {
          this.categoryAll = result.data.categoryAll;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
