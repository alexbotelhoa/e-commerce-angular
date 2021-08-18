import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.page';
import { RegisterComponent } from './pages/register/register.page';
import { AlertComponent } from './components/alert/alert.component';


@NgModule({
  declarations: [LoginComponent, AlertComponent, RegisterComponent],
  imports: [CommonModule, SharedModule, AuthRoutingModule],
})
export class AuthModule {}
