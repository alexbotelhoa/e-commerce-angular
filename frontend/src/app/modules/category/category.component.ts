import { Component, OnInit } from '@angular/core';

import { CategoryService } from './category.service';
import { CategoryFieldsFragment } from './graphql/fragments/__generated__/category.fragment.graphql.generated';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  public loading: boolean = true;
  public loading$ = this.categoryService.loading.asObservable();
  
  public categoryAll: ReadonlyArray<CategoryFieldsFragment> = [];
  public categoryAll$ = this.categoryService.categoryAll.asObservable();

  constructor(private categoryService: CategoryService) {
    this.loading$.subscribe((res) => (this.loading = res));
    this.categoryAll$.subscribe((res) => (this.categoryAll = res));
  }

  ngOnInit(): void {
    this.getCategoryAll();
  }

  getCategoryAll() {
    this.categoryService.getCategoryAll();
  }
}
