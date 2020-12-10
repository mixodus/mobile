import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LevelPage } from './level.page';
import { ComponentsModule } from '../components/components.module';
import { LevelResolver } from './level.resolver';
import { LevelService } from './level.service';

const routes: Routes = [
  {
    path: '',
    component: LevelPage,
    resolve: {
      data: LevelResolver
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
  declarations: [LevelPage],
  providers: [
    LevelResolver,
    LevelService
  ]
})
export class LevelPageModule {}
