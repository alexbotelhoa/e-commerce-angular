import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';

import { ProductService } from '../../product.service';
import { ProductFieldsFragment } from './../../graphql/fragments/__generated__/product.fragment.graphql.generated';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItemComponent implements OnInit {

  @Input()
  productAll: ReadonlyArray<ProductFieldsFragment> = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {}

  buttonDelete($event: any, item: any) {
    $event.preventDefault();
    if (confirm('Deseja realmente remover o Produto "' + item.name + '"?')) {
      this.productService.deleteProduct(item.id);
      this.productAll = this.productAll.filter(
        (product) => product.id !== item.id
      );

      if (this.productAll.length === 0) {
        this.productService.getProductAll();
      }
    }
  }
}
