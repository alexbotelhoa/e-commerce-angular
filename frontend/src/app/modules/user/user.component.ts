import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserAllGQL } from './graphql/queries/__generated__/user-all.query.graphql.generated';
import { UserFieldsFragment } from './graphql/fragments/__generated__/user.fragment.graphql.generated';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {
  userAll: ReadonlyArray<UserFieldsFragment> = [];

  destroy$ = new Subject();

  constructor(private userAllGQL: UserAllGQL) {}

  ngOnInit(): void {
    this.fetchUserAll();
  }

  // watchUserId() {
  //   this.userIdGQL
  //     .watch({
  //       id: this.userId,
  //     },
  //     {
  //       fetchPolicy: 'cache-and-network',
  //       notifyOnNetworkStatusChange: true,
  //     })
  //     .valueChanges.pipe(takeUntil(this.destroy$))
  //     .subscribe((result) => {
  //       if (result.data) {
  //         this.watch = result.data.userId;
  //       }
  //     });
  // }

  fetchUserAll() {
    this.userAllGQL
      .fetch(undefined, {
        fetchPolicy: 'network-only',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result.data) {
          this.userAll = result.data.userAll;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
