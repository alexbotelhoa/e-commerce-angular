import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from './user.service';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { UserAddComponent } from './components/user-add/user-add.component';
import { UserItemComponent } from './components/user-item/user-item.component';


@NgModule({
  declarations: [UserComponent, UserItemComponent, UserAddComponent],
  imports: [CommonModule, SharedModule, UserRoutingModule],
  providers: [UserService],
})
export class UserModule {}
