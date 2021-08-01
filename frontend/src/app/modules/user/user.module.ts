import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserItemComponent } from './components/user-item/user-item.component';
import { UserAddComponent } from './components/user-add/user-add.component';


@NgModule({
  declarations: [UserComponent, UserItemComponent, UserAddComponent],
  imports: [CommonModule, SharedModule, UserRoutingModule],
})
export class UserModule {}
