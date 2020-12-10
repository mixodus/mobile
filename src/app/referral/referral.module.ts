import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReferralPage } from './referral.page';
import { ComponentsModule } from '../components/components.module';
import { ReferralResolver } from './referral.resolver';
import { ReferralService } from './referral.service';
import {ReferralModalPage} from './modal/referral-modal.page';
const routes: Routes = [
  {
    path: '',
    component: ReferralPage,
    resolve: {
      data: ReferralResolver,
    },
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [ReferralPage,ReferralModalPage],
  entryComponents:[ReferralModalPage],
  providers: [
    ReferralResolver,
    ReferralService,
  ]
})
export class ReferralPageModule {}
