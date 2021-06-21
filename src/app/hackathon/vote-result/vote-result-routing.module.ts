import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VoteResultPage } from './vote-result.page';

const routes: Routes = [
  {
    path: '',
    component: VoteResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoteResultPageRoutingModule {}
