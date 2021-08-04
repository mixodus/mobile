import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectionPage } from './connection.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectionPage
  },
  {
    path: 'connection-details',
    loadChildren: () => import('./connection-details/connection-details.module').then( m => m.ConnectionDetailsPageModule)
  },
  {
    path: 'my-connection',
    loadChildren: () => import('./discover-connection/discover-connection.module').then( m => m.DiscoverConnectionModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionPageRoutingModule {}
