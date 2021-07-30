import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserGQL } from './../../shared/graphql/queries/__generated__/user.query.graphql.generated';
import { UserFieldsFragment } from '../../../../src/app/shared/graphql/fragments/__generated__/user.fragment.graphql.generated';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {
  userId: string = '4';
  fetch!: UserFieldsFragment | null;
  watch!: UserFieldsFragment | null;

  arrayComponent = [
    {
      id: 1,
      name: 'Teste Botelho 1',
      email: 'E-mail Botelho 1',
    },
    {
      id: 2,
      name: 'Alex Botelho 2',
      email: 'E-mail Botelho 2',
    },
    {
      id: 3,
      name: 'Alex Botelho 3',
      email: 'E-mail Botelho 3',
    },
  ];

  arrayBanco = [];

  destroy$ = new Subject();

  constructor(private userGQL: UserGQL) {}

  ngOnInit(): void {
    this.userGQL
      .fetch(
        {
          filter: { id: this.userId },
        },
        {
          fetchPolicy: 'network-only',
        }
      )
      .subscribe((result) => {
        if (result.data) {
          this.fetch = result.data.user;
        }
      });

    this.userGQL
      .watch(
        {
          filter: { id: this.userId },
        },
        {
          fetchPolicy: 'cache-and-network',
          notifyOnNetworkStatusChange: true,
        }
      )
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result.data) {
          this.watch = result.data.user;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
