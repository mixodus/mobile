import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CertificationPage } from './certification.page';
import { CertificationResolver } from './certification.resolver';
import { CertificationService } from './certification.service';
import { ComponentsModule } from '../../../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: CertificationPage,
    resolve: {
      data: CertificationResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CertificationPage],
  providers: [
    CertificationResolver,
    CertificationService
  ]
})
export class CertificationPageModule {}
