import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditWorkExperiencePage } from './edit-work-experience.page';
import { ComponentsModule } from '../../../../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: EditWorkExperiencePage
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditWorkExperiencePage]
})
export class EditWorkExperiencePageModule {}
