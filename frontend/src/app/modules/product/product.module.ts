import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductService } from './product.service';
import { ProductComponent } from './product.component';
import { SharedModule } from '../../shared/shared.module';
import { ProductRoutingModule } from './product-routing.module';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductCreateComponent } from './components/product-create/product-create.component';
import { ProductUpdateComponent } from './components/product-update/product-update.component';


@NgModule({
  declarations: [
    ProductComponent,
    ProductItemComponent,
    ProductFormComponent,
    ProductCreateComponent,
    ProductUpdateComponent,
  ],
  imports: [CommonModule, SharedModule, ProductRoutingModule],
  providers: [ProductService],
})
export class ProductModule {}
