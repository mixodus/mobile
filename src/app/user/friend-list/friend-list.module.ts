import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FriendListPage } from './friend-list.page';
import { FriendListResolver } from './friend-list.resolver';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { FriendListService } from './friend-list.service';
import { ZoomImageModalModule } from '../../modal/zoom-image-modal/zoom-image-modal.module';

const routes: Routes = [
  {
    path: '',
    component: FriendListPage,
    resolve:{
      data: FriendListResolver
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
  declarations: [FriendListPage],
  providers: [
    FriendListResolver,
    FriendListService
  ]
})
export class FriendListPageModule {}
