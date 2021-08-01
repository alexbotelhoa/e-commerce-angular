import { CategoryFieldsFragment } from './../../graphql/fragments/__generated__/category.fragment.graphql.generated';
import { Component, Input, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryItemComponent implements OnInit {
  @Input()
  categoryAll: ReadonlyArray<CategoryFieldsFragment> = [];

  constructor() {}

  ngOnInit(): void {}

  buttonDelete($event: any, item: any) {
    $event.preventDefault();
    if (confirm('Deseja remover o usuário "' + item.name + '"?')) {
      // this.categoryService.remover(category.id);
      this.categoryAll = this.categoryAll.filter(
        (category) => category.id !== item.id
      );
    }
  }
}
