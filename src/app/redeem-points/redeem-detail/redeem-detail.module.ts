import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RedeemDetailPage } from './redeem-detail.page';
import { RedeemItemInfoComponent } from '../redeem-item-info/redeem-item-info.component';
import { RedeemMenuPageModule } from '../redeem-menu/redeem-menu.module';
import { RedeemItemInfoModule } from '../redeem-item-info/redeem-item-info.module';

const routes: Routes = [
  {
    path: '',
    component: RedeemDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    RedeemItemInfoModule
  ],
  entryComponents : [RedeemItemInfoComponent],
  declarations: [RedeemDetailPage],
})
export class RedeemDetailPageModule {}
