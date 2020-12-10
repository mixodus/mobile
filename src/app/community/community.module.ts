import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserFriendsPage } from './community.page';
import { ComponentsModule } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: UserFriendsPage,
    // resolve: {
    //   data: UserFriendsResolver
    // }
    children: [
      {
        path: '',
        redirectTo: 'leaderboard',
        pathMatch: 'full'
      },
      {
        path: 'level',
        loadChildren: () => import('../level/level.module').then(m => m.LevelPageModule)
      },
      {
        path: 'leaderboard',
        loadChildren: () => import('../leaderboard/leaderboard.module').then(m => m.LeaderboardPageModule)
      },
      {
        path: 'challenges',
        children: [
          {
            path: '',
            loadChildren: () => import('../challenges/challenges.module').then(m => m.ChallengesPageModule)
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [UserFriendsPage],
})
export class UserFriendsPageModule { }
