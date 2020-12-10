import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedeemItemInfoComponent } from './redeem-item-info.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [RedeemItemInfoComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [
    RedeemItemInfoComponent
  ]
})
export class RedeemItemInfoModule { }
