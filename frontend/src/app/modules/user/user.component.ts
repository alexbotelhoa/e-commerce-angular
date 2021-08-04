import { UserService } from './user.service';
import { Component, OnInit } from '@angular/core';
import { UserFieldsFragment } from './graphql/fragments/__generated__/user.fragment.graphql.generated';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  userAll: ReadonlyArray<UserFieldsFragment> = [];
  userAll$ = this.userService.userAll.asObservable();
  loading = true;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserAll();
    this.userAll$.subscribe((res) => {
      this.userAll = res;
      if (res.length > 0) this.loading = false;
    });    
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

  getUserAll() {
    this.userService.getUserAll();
  }
}
