import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { delay, takeUntil, finalize } from 'rxjs/operators';

import { UserCreateModel, UserUpdateModel } from './models/user.models';
import { UserAllGQL } from './graphql/queries/__generated__/user-all.query.graphql.generated';
import { UserByIdGQL } from './graphql/queries/__generated__/user-id.query.graphql.generated';
import { UserFieldsFragment } from './graphql/fragments/__generated__/user.fragment.graphql.generated';
import { CreateUserGQL } from './graphql/mutations/__generated__/user-create.mutation.graphql.generated';
import { UpdateUserGQL } from './graphql/mutations/__generated__/user-update.mutation.graphql.generated';
import { DeleteUserGQL } from './graphql/mutations/__generated__/user-delete.mutation.graphql.generated';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  public destroy$ = new Subject();

  public loading = new BehaviorSubject<boolean>(true);
  public userAll = new BehaviorSubject<UserFieldsFragment[]>([]);
  public userId = new BehaviorSubject<UserFieldsFragment[]>([]);

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private userAllGQL: UserAllGQL,
    private userByIdGQL: UserByIdGQL,
    private createUserGQL: CreateUserGQL,
    private updateUserGQL: UpdateUserGQL,
    private deleteUserGQL: DeleteUserGQL
  ) {}

  getUserAll() {
    this.userAllGQL
      .fetch(undefined, {
        fetchPolicy: 'network-only',
      })
      .pipe(
        delay(1000),
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

  getUserId(item: string) {
    this.userByIdGQL
      .fetch(
        {
          id: item,
        },
        {
          fetchPolicy: 'network-only',
        }
      )
      .pipe(
        delay(1000),
        takeUntil(this.destroy$),
        finalize(() => this.loading.next(false))
      )
      .subscribe((result) => {
        const user: any =
          result.data && result.data.userById
            ? result.data.userById
            : ([] as any);

        this.userId.next(user);
      });
  }

  createUser(data: UserCreateModel) {
    this.createUserGQL
      .mutate({
        data: {
          name: data.name,
          email: data.email,
          cpf: data.cpf,
          phone: data.phone,
          level: Number(data.level),
          hasActive: data.hasActive,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.next(true))
      )
      .subscribe(
        () => {
          this.toastr.success('Usuário cadastrado com sucesso!');
          this.router.navigate(['user/list']);
        },
        (ob: any) => {
          const obStringify = JSON.stringify(ob.networkError.error.errors);
          const obParsed = JSON.parse(obStringify);
          const obError = obParsed[0];
          this.toastr.error(obError.message);
        }
      );
  }

  updateUser(data: UserUpdateModel, id: string) {
    this.updateUserGQL
      .mutate({
        data: {
          id: id,
          name: data.name,
          email: data.email,
          cpf: data.cpf,
          phone: data.phone,
          level: Number(data.level),
          hasActive: data.hasActive,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.next(true))
      )
      .subscribe(
        () => {
          this.toastr.success('Usuário atualizado com sucesso!');
          this.router.navigate(['user/list']);
        },
        (ob: any) => {
          const obStringify = JSON.stringify(ob.networkError.error.errors);
          const obParsed = JSON.parse(obStringify);
          const obError = obParsed[0];
          this.toastr.error(obError.message);
        }
      );
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
          this.toastr.error('Falha ao remover Usuário.', 'Falhou');
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
