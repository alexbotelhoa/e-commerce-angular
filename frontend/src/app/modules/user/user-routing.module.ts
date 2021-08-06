import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { UserUpdateComponent } from './components/user-update/user-update.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
  },
  {
    path: 'list',
    component: UserComponent,
  },
  {
    path: 'create',
    component: UserCreateComponent,
  },
  {
    path: 'update/:id',
    component: UserUpdateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
