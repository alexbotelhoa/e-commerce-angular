import { UserService } from './../../user.service';
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

  constructor(private userService: UserService) {}

  ngOnInit(): void {}

  buttonDelete($event: any, user: any) {
    $event.preventDefault();
    if (confirm('Deseja realmente remover o Usuário "' + user.name + '"?')) {
      this.userService.deleteUser(user.id);
      this.userAll = this.userAll.filter(
        (user) => user.id !== user.id
      );
    }
  }
}
