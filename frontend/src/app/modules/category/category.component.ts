import { CategoryService } from './category.service';
import { Component, OnInit } from '@angular/core';

import { CategoryFieldsFragment } from './graphql/fragments/__generated__/category.fragment.graphql.generated';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  categoryAll: ReadonlyArray<CategoryFieldsFragment> = [];
  loading: boolean = true;

  categoryAll$ = this.categoryService.categoryAll.asObservable();
  loading$ = this.categoryService.loading.asObservable();

  constructor(private categoryService: CategoryService) {
    this.categoryAll$.subscribe((res) => (this.categoryAll = res));
    this.loading$.subscribe((res) => (this.loading = res));
  }

  ngOnInit(): void {
    this.getCategoryAll();
  }

  getCategoryAll() {
    this.categoryService.getCategoryAll();
  }
}
