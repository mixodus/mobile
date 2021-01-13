import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddSkillsPage } from './add-skills.page';
import { ComponentsModule } from '../../../../../app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: AddSkillsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [AddSkillsPage]
})
export class AddSkillsPageModule {}
