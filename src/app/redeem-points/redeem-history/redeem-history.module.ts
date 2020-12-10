import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RedeemHistoryPage } from './redeem-history.page';

const routes: Routes = [
  {
    path: '',
    component: RedeemHistoryPage,
    
      children: [
      {
        path: '',
        redirectTo: 'redeem-history-list',
        pathMatch: 'full'
      },
      {
        path: 'redeem-history-list',
        loadChildren: () => import('./redeem-history-list/redeem-history-list.module').then(m => m.RedeemHistoryListPageModule)
      },
      {
        path: 'my-rewards-list',
        loadChildren: () => import('./my-rewards-list/my-rewards-list.module').then(m => m.MyRewardsListPageModule)
      },
    ]
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RedeemHistoryPage]
})
export class RedeemHistoryPageModule {}
