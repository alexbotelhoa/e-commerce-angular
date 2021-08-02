import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { UserAllGQL } from './graphql/queries/__generated__/user-all.query.graphql.generated';
import { UserFieldsFragment } from './graphql/fragments/__generated__/user.fragment.graphql.generated';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  public userAll = new BehaviorSubject<UserFieldsFragment[]>([]);

  destroy$ = new Subject();

  constructor(private userAllGQL: UserAllGQL) {}

  getUserAll() {
    this.userAll.next([]);
    
    this.userAllGQL
      .fetch(undefined, {
        fetchPolicy: 'network-only',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        const user: any =
          result.data && result.data.userAll
            ? result.data.userAll
            : ({} as any);

        this.userAll.next(user);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
