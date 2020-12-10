import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { JobsPage } from './jobs.page';
import { JobsService } from './jobs.service';
import { JobsResolver } from './jobs.resolver';
import { JobsApplicationResolver } from './jobsapplication.resolver';
import { ComponentsModule } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: JobsPage,
    resolve: {
      data: JobsResolver,
      dataJobApply: JobsApplicationResolver
    }
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [JobsPage],
  providers: [
    JobsResolver,
    JobsApplicationResolver,
    JobsService
  ]
})
export class JobsPageModule {
}
