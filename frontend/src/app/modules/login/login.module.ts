import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './pages/login/login.page';
import { SharedModule } from '../../shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';
import { RegisterComponent } from './pages/register/register.page';
import { AlertComponent } from './components/alert/alert.component';


@NgModule({
  declarations: [LoginComponent, AlertComponent, RegisterComponent],
  imports: [CommonModule, SharedModule, LoginRoutingModule],
})
export class LoginModule {}
