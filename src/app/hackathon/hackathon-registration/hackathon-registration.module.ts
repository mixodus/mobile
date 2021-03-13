import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HackathonRegistrationPage } from './hackathon-registration.page';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { Camera } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';

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
  declarations: [HackathonRegistrationPage, TermsConditionsComponent],
  entryComponents: [TermsConditionsComponent],
  providers: [Camera, Crop]
})
export class HackathonRegistrationPageModule {
}
