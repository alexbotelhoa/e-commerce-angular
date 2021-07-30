import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { UserFieldsFragment } from '../../graphql/fragments/__generated__/user.fragment.graphql.generated';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserItemComponent implements OnInit {
  @Input()
  user: UserFieldsFragment | null = null;

  constructor() {}

  ngOnInit(): void {}
}
