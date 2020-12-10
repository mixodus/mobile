import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditPage } from './profile-edit.page';
import { ComponentsModule } from '../../../components/components.module';
import { Camera } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx'
import { File } from '@ionic-native/file/ngx'

const routes: Routes = [
  {
    path: '',
    component: EditPage,
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditPage],
  providers:[
    Camera,
    Crop,
    WebView,
    File,
  ]
})
export class EditPageModule {}
