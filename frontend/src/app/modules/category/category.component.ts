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
  categoryAll$ = this.categoryService.categoryAll.asObservable();

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.getCategoryAll();
    this.categoryAll$.subscribe((res) => (this.categoryAll = res));
  }

  getCategoryAll() {
    this.categoryService.getCategoryAll();
  }
}
