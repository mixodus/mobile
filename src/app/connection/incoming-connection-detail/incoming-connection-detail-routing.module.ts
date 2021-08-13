import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncomingConnectionDetailPage } from './incoming-connection-detail.page';

const routes: Routes = [
  {
    path: '',
    component: IncomingConnectionDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncomingConnectionDetailPageRoutingModule {}
