import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';

import { JobDetailsPage } from './job-details.page';
import { JobDetailsResolver } from './job-details.resolver';
import { JobDetailService } from './job-detail.service';
import { JobDetailsModel } from './job-details.model';
import { UserProfileResolver } from '../../user/profile/user-profile.resolver';
import { UserService } from '../../user/user.service';
const routes: Routes = [
  {
    path: '',
    component: JobDetailsPage,
    resolve: {
      data: JobDetailsResolver,
      special: UserProfileResolver,
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    HttpClientModule
  ],
  declarations: [
    JobDetailsPage
  ],
  providers: [
    JobDetailsModel,
    JobDetailsResolver,
    JobDetailService,
    UserProfileResolver,
    UserService,
  ]
})
export class JobDetailsPageModule {}
