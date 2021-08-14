import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncomingConnectionDetailPageRoutingModule } from './incoming-connection-detail-routing.module';

import { IncomingConnectionDetailPage } from './incoming-connection-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncomingConnectionDetailPageRoutingModule
  ],
  declarations: [IncomingConnectionDetailPage]
})
export class IncomingConnectionDetailPageModule {}
