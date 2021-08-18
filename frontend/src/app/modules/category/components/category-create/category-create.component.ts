import { Component, OnInit, ViewChild } from '@angular/core';

import { CategoryService } from '../../category.service';
import { CategoryCreateModel } from '../../models/category.model';
import { CategoryFormComponent } from '../category-form/category-form.component';


@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css'],
})
export class CategoryCreateComponent implements OnInit {
  @ViewChild(CategoryFormComponent)
  categoryForm: CategoryFormComponent | any = false;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {}

  sendForm() {
    const disabled = this.categoryForm?.categoryFormGroup.invalid;
    if (!disabled) {
      const data: CategoryCreateModel = this.categoryForm?.categoryFormGroup.value;
      this.categoryService.createCategory(data);
    }
  }
}
