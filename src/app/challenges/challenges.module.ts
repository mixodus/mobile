import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChallengesPage } from './challenges.page';
import { ComponentsModule } from '../components/components.module';
import { PipesModule } from '../pipes/pipes.module';
import { HttpClientModule } from '@angular/common/http';
import { ChallengesResolver } from './challenges.resolver';
import { ChallengesService } from './challenges.service';

const routes: Routes = [
  {
    path: '',
    component: ChallengesPage,
    resolve:{
      data: ChallengesResolver
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
  declarations: [ChallengesPage],
  providers: [
    ChallengesResolver,
    ChallengesService
  ]
})
export class ChallengesPageModule {}
