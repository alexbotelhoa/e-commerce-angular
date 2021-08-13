import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CategoryService } from '../../category.service';
import { CategoryUpdateModel } from '../../models/category.models';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { CategoryFieldsFragment } from '../../graphql/fragments/__generated__/category.fragment.graphql.generated';


@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.css'],
})
export class CategoryUpdateComponent implements OnInit {
  @ViewChild(CategoryFormComponent)
  categoryForm: CategoryFormComponent | any = false;

  public loading: boolean = true;
  public loading$ = this.categoryService.loading.asObservable();

  public categoryId: CategoryFieldsFragment[] | null = null;
  public categoryId$ = this.categoryService.categoryId.asObservable();

  public selectedCategoryId: string = '';

  constructor(
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute
  ) {
    this.categoryId$.subscribe((res) => (this.categoryId = res));
    this.loading$.subscribe((res) => (this.loading = res));
    this.activatedRoute.params.subscribe(
      (params) => (this.selectedCategoryId = params['id'])
    );
  }

  ngOnInit(): void {
    this.getCategoryId();
  }

  getCategoryId() {
    this.categoryService.getCategoryId(this.selectedCategoryId);
  }

  sendForm() {
    const disabled = this.categoryForm?.categoryFormGroup.invalid;
    if (!disabled) {
      const data: CategoryUpdateModel = this.categoryForm?.categoryFormGroup.value;
      this.categoryService.updateCategory(data, this.selectedCategoryId);
    }
  }
}
