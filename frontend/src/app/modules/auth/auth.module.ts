import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.page';
import { AlertComponent } from './components/alert/alert.component';
import { RegisterComponent } from './pages/register/register.page';


@NgModule({
  declarations: [LoginComponent, AlertComponent, RegisterComponent],
  imports: [CommonModule, AuthRoutingModule],
})
export class AuthModule {}
