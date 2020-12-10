import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EasyApplyPage } from './easy-apply.page';
import { ComponentsModule } from '../../../components/components.module';

import { Chooser } from '@ionic-native/chooser/ngx'
import { FilePath } from '@ionic-native/file-path/ngx'
import { FileOpener } from '@ionic-native/file-opener/ngx'

import { UserProfileResolver } from '../../../user/profile/user-profile.resolver';
import { UserService } from '../../../user/user.service';

const routes: Routes = [
  {
    path: '',
    component: EasyApplyPage,
    // resolve: {
    //   data: UserProfileResolver
    // }
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
  declarations: [EasyApplyPage],
  providers: [
    Chooser,
    FilePath,
    FileOpener
    // UserProfileResolver,
    // UserService,
  ]
})
export class EasyApplyPageModule {}
