import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LeaderboardPage } from './leaderboard.page';
import { ComponentsModule } from '../components/components.module';
import { LeaderboardResolver } from './leaderboard.resolver';
import { LeaderboardService } from './leaderboard.service';

const routes: Routes = [
  {
    path: '',
    component: LeaderboardPage,
    resolve: {
      data: LeaderboardResolver
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
  declarations: [LeaderboardPage],
  providers: [
    LeaderboardResolver,
    LeaderboardService
  ]
})
export class LeaderboardPageModule {}
