import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VoteResultPageRoutingModule } from './vote-result-routing.module';

import { VoteResultPage } from './vote-result.page';

import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: VoteResultPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VoteResultPageRoutingModule
  ],
  declarations: [VoteResultPage],
})
export class VoteResultPageModule {}
