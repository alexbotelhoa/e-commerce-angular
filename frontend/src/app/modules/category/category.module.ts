import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryService } from './category.service';
import { CategoryComponent } from './category.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryAddComponent } from './components/category-add/category-add.component';
import { CategoryItemComponent } from './components/category-item/category-item.component';


@NgModule({
  declarations: [CategoryComponent, CategoryItemComponent, CategoryAddComponent],
  imports: [CommonModule, SharedModule, CategoryRoutingModule],
  providers: [CategoryService]
})
export class CategoryModule {}
