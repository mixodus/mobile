import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RedeemItemPage } from './redeem-item.page';
import { ComponentsModule } from '../../components/components.module';
import { RedeemItemResolver } from './redeem-item.resolver';

const routes: Routes = [
  {
    path: '',
    component: RedeemItemPage,
    resolve: {
      data: RedeemItemResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RedeemItemPage],
  providers: [
    RedeemItemResolver
  ]
})
export class RedeemItemPageModule {}
