import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QuizPage } from './quiz.page';
import { QuizResolver } from './quiz.resolver';
import { QuizService } from './quiz.service';
import { ComponentsModule } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: QuizPage,
    resolve: {
      data: QuizResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [QuizPage],
  providers: [
    QuizResolver,
    QuizService
  ]
})
export class QuizPageModule {}
