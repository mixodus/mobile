import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AchievementsPage } from './achievements.page';
import { AchievementsResolver } from './achievements.resolver';
import { AchievementsService } from './achievements.service';
import { ComponentsModule } from '../../../components/components.module';
import { ProfileResolver } from './profile.resolver';

const routes: Routes = [
  {
    path: '',
    component: AchievementsPage,
    resolve:{
      data: AchievementsResolver,
      profile: ProfileResolver
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
  declarations: [AchievementsPage],
  providers:[
    AchievementsResolver,
    AchievementsService,
    ProfileResolver
  ]
})
export class AchievementsPageModule {}
