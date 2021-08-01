import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductService } from './product.service';
import { ProductComponent } from './product.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductRoutingModule } from './product-routing.module';
import { ProductAddComponent } from './components/product-add/product-add.component';
import { ProductItemComponent } from './components/product-item/product-item.component';


@NgModule({
  declarations: [ProductComponent, ProductAddComponent, ProductItemComponent],
  imports: [CommonModule, SharedModule, ProductRoutingModule],
  providers: [ProductService]
})
export class ProductModule {}
