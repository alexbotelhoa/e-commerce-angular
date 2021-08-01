import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category.component';
import { CategoryAddComponent } from './components/category-add/category-add.component';

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
    path: 'add',
    component: CategoryAddComponent,
  },
  {
    path: 'edit/:id',
    component: CategoryAddComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
