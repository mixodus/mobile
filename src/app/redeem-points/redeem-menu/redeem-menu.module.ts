import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RedeemMenuPage } from './redeem-menu.page';
import { RedeemItemInfoComponent } from '../redeem-item-info/redeem-item-info.component';
import { RedeemItemInfoModule } from '../redeem-item-info/redeem-item-info.module';
import { ComponentsModule } from '../../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: RedeemMenuPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    RedeemItemInfoModule,
    ComponentsModule
  ],
  entryComponents: [RedeemItemInfoComponent],
  declarations: [RedeemMenuPage],
})
export class RedeemMenuPageModule {}
