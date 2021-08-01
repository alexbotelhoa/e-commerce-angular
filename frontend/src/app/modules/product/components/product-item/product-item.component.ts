import { ProductFieldsFragment } from './../../graphql/fragments/__generated__/product.fragment.graphql.generated';
import { Component, Input, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

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

  constructor() {}

  ngOnInit(): void {}

  buttonDelete($event: any, item: any) {
    $event.preventDefault();
    if (confirm('Deseja remover o usuário "' + item.name + '"?')) {
      // this.productService.remover(product.id);
      this.productAll = this.productAll.filter(
        (product) => product.id !== item.id
      );
    }
  }
}
