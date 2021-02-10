import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HackathonRegistrationPage } from './hackathon-registration.page';

const routes: Routes = [
  {
    path: '',
    component: HackathonRegistrationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [HackathonRegistrationPage]
})
export class HackathonRegistrationPageModule {}
