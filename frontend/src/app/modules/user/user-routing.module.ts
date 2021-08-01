import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { RouterModule, Routes } from '@angular/router';
import { UserAddComponent } from './components/user-add/user-add.component';

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
    path: 'add',
    component: UserAddComponent,
  },
  {
    path: 'edit/:id',
    component: UserAddComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
