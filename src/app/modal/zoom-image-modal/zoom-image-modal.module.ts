import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ZoomImageModalComponent } from './zoom-image-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [ZoomImageModalComponent],
  exports: [
      ZoomImageModalComponent
  ],
  entryComponents: [
      ZoomImageModalComponent
  ]
})
export class ZoomImageModalModule {}
