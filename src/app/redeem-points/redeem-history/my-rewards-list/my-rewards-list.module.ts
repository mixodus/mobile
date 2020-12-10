import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyRewardsListPage } from './my-rewards-list.page';

const routes: Routes = [
  {
    path: '',
    component: MyRewardsListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyRewardsListPage]
})
export class MyRewardsListPageModule {}
