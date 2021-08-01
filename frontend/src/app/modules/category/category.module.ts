import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryComponent } from './category.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryItemComponent } from './components/category-item/category-item.component';
import { CategoryAddComponent } from './components/category-add/category-add.component';


@NgModule({
  declarations: [CategoryComponent, CategoryItemComponent, CategoryAddComponent],
  imports: [CommonModule, SharedModule, CategoryRoutingModule],
})
export class CategoryModule {}
