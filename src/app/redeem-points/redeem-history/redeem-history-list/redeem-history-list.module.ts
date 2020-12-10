import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RedeemHistoryListPage } from './redeem-history-list.page';

const routes: Routes = [
  {
    path: '',
    component: RedeemHistoryListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RedeemHistoryListPage]
})
export class RedeemHistoryListPageModule {}
