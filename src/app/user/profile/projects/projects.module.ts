import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProjectsPage } from './projects.page';
import { ComponentsModule } from '../../../components/components.module';
import { ProjectResolver } from './projects.resolver';
import { ProjectService } from './projects.service';
import { WorkExperienceResolver } from '../work-experiences/work-experiences.resolver';
import { WorkExperienceService } from '../work-experiences/work-experiences.service';

const routes: Routes = [
  {
    path: '',
    component: ProjectsPage,
    resolve:{
      data: ProjectResolver,
      special: WorkExperienceResolver
    }
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProjectsPage],
  providers: [
    ProjectResolver,
    ProjectService,
    WorkExperienceResolver,
    WorkExperienceService
  ]
})
export class ProjectsPageModule {}
