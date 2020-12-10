import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WorkExperiencesPage } from './work-experiences.page';
import { ComponentsModule } from '../../../components/components.module';
import { WorkExperienceResolver } from './work-experiences.resolver';
import { WorkExperienceService } from './work-experiences.service';

const routes: Routes = [
  {
    path: '',
    component: WorkExperiencesPage,
    resolve:
    {
      data: WorkExperienceResolver
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
  declarations: [WorkExperiencesPage],
  providers: [
    WorkExperienceResolver,
    WorkExperienceService
  ]
})
export class WorkExperiencesPageModule { }
