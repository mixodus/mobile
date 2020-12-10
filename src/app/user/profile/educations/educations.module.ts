import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EducationsPage } from './educations.page';
import { ComponentsModule } from '../../../components/components.module';
import { EducationResolver } from './educations.resolver';
import { EducationService } from './educations.service';

const routes: Routes = [
  {
    path: '',
    component: EducationsPage,
    resolve:{
      data: EducationResolver
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
  declarations: [EducationsPage],
  providers:[
    EducationResolver,
    EducationService
  ]
})
export class EducationsPageModule {}
