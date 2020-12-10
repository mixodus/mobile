import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FriendRequestPage } from './friend-request.page';
import { FriendRequestResolver } from './friend-request.resolver';
import { FriendRequestService } from './friend-request.service';
import { ComponentsModule } from '../../components/components.module';
import { ZoomImageModalModule } from '../../modal/zoom-image-modal/zoom-image-modal.module';

const routes: Routes = [
  {
    path: '',
    component: FriendRequestPage,
    resolve:{
      data: FriendRequestResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ZoomImageModalModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FriendRequestPage],
  providers: [
    FriendRequestResolver,
    FriendRequestService
  ]
})
export class FriendRequestPageModule {}
