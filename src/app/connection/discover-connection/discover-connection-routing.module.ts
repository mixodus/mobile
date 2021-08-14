import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscoverConnectionPage } from './discover-connection.page';

const routes: Routes = [
  {
    path: '',
    component: DiscoverConnectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscoverConnectionPageRoutingModule {}
