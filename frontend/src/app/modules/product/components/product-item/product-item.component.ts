import { ProductService } from '../../product.service';
import { Component, Input, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
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

  buttonDelete($event: any, product: any) {
    $event.preventDefault();
    if (confirm('Deseja realmente remover o Produto "' + product.name + '"?')) {
      this.productService.deleteProduct(product.id);
      this.productAll = this.productAll.filter(
        (product) => product.id !== product.id
      );
    }
  }
}
