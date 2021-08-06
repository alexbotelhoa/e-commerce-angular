import { NgModule } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GraphQLModule } from './graphql/graphql.module';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ButtonCreateComponent } from './components/button/button-create/button-create.component';
import { ButtonUpdateComponent } from './components/button/button-update/button-update.component';
import { ButtonCancelComponent } from './components/button/button-cancel/button-cancel.component';
import { ButtonDeleteComponent } from './components/button/button-delete/button-delete.component';

const materialModules = [
  MatProgressSpinnerModule
];
const sharedComponents = [
  HeaderComponent,
  FooterComponent,
  LoadingComponent,
  ButtonCreateComponent,
  ButtonUpdateComponent,
  ButtonCancelComponent,
  ButtonDeleteComponent,
];
const sharedGraphql = [GraphQLModule]
const sharedServices = [[]]

@NgModule({
  declarations: [...sharedComponents],
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
