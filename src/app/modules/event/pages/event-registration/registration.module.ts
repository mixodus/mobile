import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegistrationPage } from './registration.page';
import { RegistrationResolver } from './registration.resolver';
import { ShellModule } from '../../../../shell/shell.module';
import { ProfileResolver } from './profile.resolver';

const routes: Routes = [
  {
    path: '',
    component: RegistrationPage,
    resolve: {
      event: RegistrationResolver,
      profile: ProfileResolver
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ShellModule,
    RouterModule.forChild(routes),
  ],
  declarations: [RegistrationPage],
  providers: [RegistrationResolver, ProfileResolver],
})
export class RegistrationPageModule {}
