import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule  } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { VotingPage } from './voting.page';

const routes: Routes = [
  {
    path: '',
    component: VotingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    // VotingPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VotingPage]
})
export class VotingPageModule {}
