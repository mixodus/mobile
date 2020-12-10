import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfilePage } from './profile.page';
import { ComponentsModule } from '../../components/components.module';
import { FriendProfileResolver } from './profile.resolver';
import { FriendProfileService } from './profile.service';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { PipesModule } from '../../pipes/pipes.module';
import { ZoomImageModalModule } from '../../modal/zoom-image-modal/zoom-image-modal.module';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    resolve:{
      data: FriendProfileResolver,
    }
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    PipesModule,
    ReactiveFormsModule,
    ZoomImageModalModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfilePage],
  providers: [
    FriendProfileResolver,
    FriendProfileService,
    TruncatePipe
  ]
})
export class ProfilePageModule {}
