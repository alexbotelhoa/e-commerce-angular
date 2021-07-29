import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './features/pages/home-page/home-page.component';
import { CategoriesPageComponent } from './features/pages/categories-page/categories-page.component';
import { ProductsPageComponent } from './features/pages/products-page/products-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomePageComponent
  },
  {
    path: 'category',
    component: CategoriesPageComponent
  },
  {
    path: 'product',
    component: ProductsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
