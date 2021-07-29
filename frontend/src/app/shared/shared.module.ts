import { NgModule } from '@angular/core';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

const sharedComponents = [HeaderComponent, FooterComponent];

@NgModule({
  declarations: [...sharedComponents],
  exports: [...sharedComponents],
})
export class SharedModule {}
