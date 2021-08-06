import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoryComponent } from './category.component';
import { CategoryCreateComponent } from './components/category-create/category-create.component';
import { CategoryUpdateComponent } from './components/category-update/category-update.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
  },
  {
    path: 'list',
    component: CategoryComponent,
  },
  {
    path: 'create',
    component: CategoryCreateComponent,
  },
  {
    path: 'update/:id',
    component: CategoryUpdateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
