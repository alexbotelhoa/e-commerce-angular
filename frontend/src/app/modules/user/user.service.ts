import { Injectable, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { UserAllGQL } from './graphql/queries/__generated__/user-all.query.graphql.generated';
import { UserFieldsFragment } from './graphql/fragments/__generated__/user.fragment.graphql.generated';
import { DeleteUserGQL } from './graphql/mutations/__generated__/user-delete.mutation.graphql.generated';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  public userAll = new BehaviorSubject<UserFieldsFragment[]>([]);

  destroy$ = new Subject();

  constructor(
    private toastr: ToastrService,
    private userAllGQL: UserAllGQL,
    private userDeleteGQL: DeleteUserGQL
  ) {}

  getUserAll() {
    this.userAll.next([]);

    this.userAllGQL
      .fetch(undefined, {
        fetchPolicy: 'network-only',
      })
      .pipe(delay(1000), takeUntil(this.destroy$))
      .subscribe((result) => {
        const user: any =
          result.data && result.data.userAll
            ? result.data.userAll
            : ({} as any);

        this.userAll.next(user);
      });
  }

  deleteUser(item: string) {
    this.userDeleteGQL
      .mutate({
        id: item,
      })
      .pipe(delay(1000), takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          this.toastr.success('Atividade removida.', 'Sucesso', {
            timeOut: 3000,
          });
        },
        (error) => {
          this.toastr.error('Erro removendo atividade', 'Erro');
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
