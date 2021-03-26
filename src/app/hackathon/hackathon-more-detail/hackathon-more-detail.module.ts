import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HackathonMoreDetailPage } from './hackathon-more-detail.page';

const routes: Routes = [
  {
    path: '',
    component: HackathonMoreDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [HackathonMoreDetailPage]
})
export class HackathonMoreDetailPageModule {}
