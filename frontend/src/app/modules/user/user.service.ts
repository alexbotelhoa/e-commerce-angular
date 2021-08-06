import { Injectable, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { delay, takeUntil, finalize } from 'rxjs/operators';
import { UserAllGQL } from './graphql/queries/__generated__/user-all.query.graphql.generated';
import { UserFieldsFragment } from './graphql/fragments/__generated__/user.fragment.graphql.generated';
import { DeleteUserGQL } from './graphql/mutations/__generated__/user-delete.mutation.graphql.generated';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  public userAll = new BehaviorSubject<UserFieldsFragment[]>([]);
  public loading = new BehaviorSubject<boolean>(true);

  destroy$ = new Subject();

  constructor(
    private toastr: ToastrService,
    private userAllGQL: UserAllGQL,
    private deleteUserGQL: DeleteUserGQL
  ) {}

  getUserAll() {
    this.userAll.next([]);

    this.userAllGQL
      .fetch(undefined, {
        fetchPolicy: 'network-only',
      })
      .pipe(
        delay(2000),
        takeUntil(this.destroy$),
        finalize(() => this.loading.next(false))
      )
      .subscribe((result) => {
        const user: any =
          result.data && result.data.userAll
            ? result.data.userAll
            : ({} as any);

        this.userAll.next(user);
      });
  }

  deleteUser(item: string) {
    this.deleteUserGQL
      .mutate({
        id: item,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          this.toastr.success('Usuário removido com sucesso!', 'Sucesso', {
            timeOut: 3000,
          });
        },
        (error) => {
          this.toastr.error('Falha ao tentar remover usuário.', 'Falhou');
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
