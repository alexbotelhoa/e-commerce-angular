import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from './user.service';
import { UserComponent } from './user.component';
import { SharedModule } from '../../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserItemComponent } from './components/user-item/user-item.component';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { UserUpdateComponent } from './components/user-update/user-update.component';


@NgModule({
  declarations: [
    UserComponent,
    UserItemComponent,
    UserFormComponent,
    UserCreateComponent,
    UserUpdateComponent,
  ],
  imports: [CommonModule, SharedModule, UserRoutingModule],
  providers: [UserService],
})
export class UserModule {}
