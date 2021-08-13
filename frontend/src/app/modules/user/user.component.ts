import { Component, OnInit } from '@angular/core';

import { UserService } from './user.service';
import { UserFieldsFragment } from './graphql/fragments/__generated__/user.fragment.graphql.generated';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  public loading: boolean = true;
  public loading$ = this.userService.loading.asObservable();

  public userAll: ReadonlyArray<UserFieldsFragment> = [];
  public userAll$ = this.userService.userAll.asObservable();

  constructor(private userService: UserService) {
    this.loading$.subscribe((res) => (this.loading = res));
    this.userAll$.subscribe((res) => (this.userAll = res));
  }

  ngOnInit(): void {
    this.getUserAll();
  }

  getUserAll() {
    this.userService.getUserAll();
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

  // fetchUserAll() {
  //   this.userAllGQL
  //     .fetch(undefined, {
  //       fetchPolicy: 'network-only',
  //     })
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((result) => {
  //       if (result.data) {
  //         this.userAll = result.data.userAll;
  //       }
  //     });
  // }
}
