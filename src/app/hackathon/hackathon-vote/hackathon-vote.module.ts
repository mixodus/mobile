import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HackathonVotePage } from './hackathon-vote.page';
import { HomeService} from '../../home/home.service';

const routes: Routes = [
  {
    path: '',
    component: HackathonVotePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HackathonVotePage],
  providers:[ HomeService,]
})
export class HackathonVotePageModule {}
