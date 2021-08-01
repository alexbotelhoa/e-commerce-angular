import { NgModule } from '@angular/core';

import { GraphQLModule } from './graphql/graphql.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ButtonAddComponent } from './components/button/button-add/button-add.component';
import { ButtonEditComponent } from './components/button/button-edit/button-edit.component';
import { ButtonCancelComponent } from './components/button/button-cancel/button-cancel.component';
import { ButtonDeleteComponent } from './components/button/button-delete/button-delete.component';

const sharedComponents = [
  HeaderComponent,
  FooterComponent,
  ButtonAddComponent,
  ButtonEditComponent,
  ButtonCancelComponent,
  ButtonDeleteComponent,
];
const sharedGraphql = [GraphQLModule]
const sharedServices = [[]]

@NgModule({
  declarations: [...sharedComponents],
  imports: [...sharedGraphql, ...sharedServices],
  exports: [...sharedComponents, ...sharedGraphql, ...sharedServices],
})
export class SharedModule {}
