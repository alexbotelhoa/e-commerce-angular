import { Component, Input, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { UserFieldsFragment } from '../../graphql/fragments/__generated__/user.fragment.graphql.generated';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserItemComponent implements OnInit {
  @Input()
  userAll: ReadonlyArray<UserFieldsFragment> = [];

  constructor() {}

  ngOnInit(): void {}

  buttonDelete($event: any, item: any) {
    $event.preventDefault();
    if (confirm('Deseja remover o usuário "' + item.name + '"?')) {
      // this.userService.remover(user.id);
      this.userAll = this.userAll.filter(
        (user) => user.id !== item.id
      );
    }
  }
}
