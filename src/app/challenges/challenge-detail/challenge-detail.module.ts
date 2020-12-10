import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChallengeDetailPage } from './challenge-detail.page';
import { ComponentsModule } from '../../../app/components/components.module';
import { PipesModule } from '../../../app/pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { ChallengeDetailResolver } from './challenge-detail.resolver';
import { ChallengesService } from '../challenges.service';

const routes: Routes = [
  {
    path: '',
    component: ChallengeDetailPage,
    resolve: {
      data: ChallengeDetailResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PipesModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ChallengeDetailPage],
  providers:[
    ChallengeDetailResolver,
    ChallengesService
  ]
})
export class ChallengeDetailPageModule {}
