import { NgModule } from '@angular/core';

import { GraphQLModule } from './graphql/graphql.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

const sharedComponents = [HeaderComponent, FooterComponent];
const sharedGraphql = [GraphQLModule]
const sharedServices = [[]]

@NgModule({
  declarations: [...sharedComponents],
  imports: [...sharedGraphql, ...sharedServices],
  exports: [...sharedComponents, ...sharedGraphql, ...sharedServices],
})
export class SharedModule {}
