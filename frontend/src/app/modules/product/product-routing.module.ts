import { NgModule } from '@angular/core';
import { ProductComponent } from './product.component';
import { RouterModule, Routes } from '@angular/router';
import { ProductAddComponent } from './components/product-add/product-add.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
  },
  {
    path: 'list',
    component: ProductComponent,
  },
  {
    path: 'add',
    component: ProductAddComponent,
  },
  {
    path: 'edit/:id',
    component: ProductAddComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
