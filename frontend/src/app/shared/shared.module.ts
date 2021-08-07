import { NgModule } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { GraphQLModule } from './graphql/graphql.module';

import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ButtonCreateComponent } from './components/button/button-create/button-create.component';
import { ButtonUpdateComponent } from './components/button/button-update/button-update.component';
import { ButtonCancelComponent } from './components/button/button-cancel/button-cancel.component';
import { ButtonDeleteComponent } from './components/button/button-delete/button-delete.component';

const materialModules = [
  MatInputModule,
  MatSelectModule,
  MatFormFieldModule,
  MatProgressSpinnerModule,
];

const sharedGraphql = [GraphQLModule];

const sharedModules = [
  FormsModule,
  CommonModule,
  ReactiveFormsModule,
];

const sharedServices = [[]];

const sharedComponents = [  
  HeaderComponent,
  FooterComponent,
  LoadingComponent,
  ButtonCreateComponent,
  ButtonUpdateComponent,
  ButtonCancelComponent,
  ButtonDeleteComponent,
];

@NgModule({
  declarations: [...sharedComponents],
  imports: [
    ...materialModules,
    ...sharedGraphql,
    ...sharedModules,
    ...sharedServices,
  ],
  exports: [
    ...materialModules,
    ...sharedGraphql,
    ...sharedModules,
    ...sharedServices,
    ...sharedComponents,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
      },
    },
  ],
})
export class SharedModule {}
