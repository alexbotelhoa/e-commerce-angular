import { CategoryService } from '../../category.service';
import { Component, Input, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CategoryFieldsFragment } from './../../graphql/fragments/__generated__/category.fragment.graphql.generated';

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

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {}

   buttonDelete($event: any, item: any) {
    $event.preventDefault();
    if (confirm('Deseja realmente remover a Categoria "' + item.name + '"?')) {
      this.categoryService.deleteCategory(item.id);
      this.categoryAll = this.categoryAll.filter(
        (category) => category.id !== item.id
      );

      if (this.categoryAll.length === 0) {
        this.categoryService.getCategoryAll();
      }
    }
  }
}
