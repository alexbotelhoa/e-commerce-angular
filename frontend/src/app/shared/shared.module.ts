import { NgModule } from '@angular/core';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomePageComponent } from '../features/pages/home-page/home-page.component';
import { ProductsPageComponent } from '../features/pages/products-page/products-page.component';
import { CategoriesPageComponent } from '../features/pages/categories-page/categories-page.component';

const sharedPages = [
  HomePageComponent,
  ProductsPageComponent,
  CategoriesPageComponent,
];
const sharedComponents = [HeaderComponent, FooterComponent];

@NgModule({
  declarations: [...sharedPages, ...sharedComponents],
  imports: [],
  exports: [...sharedComponents],
  providers: [],
})
export class SharedModule {}
