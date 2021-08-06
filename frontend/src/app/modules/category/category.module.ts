import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryService } from './category.service';
import { CategoryComponent } from './category.component';
import { SharedModule } from '../../shared/shared.module';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryItemComponent } from './components/category-item/category-item.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { CategoryCreateComponent } from './components/category-create/category-create.component';
import { CategoryUpdateComponent } from './components/category-update/category-update.component';


@NgModule({
  declarations: [
    CategoryComponent,
    CategoryItemComponent,
    CategoryFormComponent,
    CategoryCreateComponent,
    CategoryUpdateComponent,
  ],
  imports: [CommonModule, SharedModule, CategoryRoutingModule],
  providers: [CategoryService],
})
export class CategoryModule {}
