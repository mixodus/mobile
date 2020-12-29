import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file';
import { IonicModule } from '@ionic/angular';

import { EditCertificationPage } from './edit-certification.page';
import { CertificationResolver } from '../certification.resolver';
import { CertificationService } from '../certification.service';

const routes: Routes = [
  {
    path: '',
    component: EditCertificationPage,
    resolve: {
      CertificationResolver
    }
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditCertificationPage],
  providers: [CertificationResolver,
    CertificationService]
})
export class EditCertificationPageModule {}
