import { NgModule } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GraphQLModule } from './graphql/graphql.module';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ButtonAddComponent } from './components/button/button-add/button-add.component';
import { ButtonEditComponent } from './components/button/button-edit/button-edit.component';
import { ButtonCancelComponent } from './components/button/button-cancel/button-cancel.component';
import { ButtonDeleteComponent } from './components/button/button-delete/button-delete.component';
import { LoadingComponent } from './components/loading/loading.component';

const materialModules = [
  MatProgressSpinnerModule
];
const sharedComponents = [
  HeaderComponent,
  FooterComponent,
  LoadingComponent,
  ButtonAddComponent,
  ButtonEditComponent,
  ButtonCancelComponent,
  ButtonDeleteComponent,
];
const sharedGraphql = [GraphQLModule]
const sharedServices = [[]]

@NgModule({
  declarations: [...sharedComponents, LoadingComponent],
  imports: [
    ...materialModules,
    ...sharedGraphql,
    ...sharedServices
  ],
  exports: [
    ...materialModules,
    ...sharedComponents,
    ...sharedGraphql,
    ...sharedServices
  ],
})
export class SharedModule {}
