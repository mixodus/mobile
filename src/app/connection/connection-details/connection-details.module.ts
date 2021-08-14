import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConnectionDetailsPageRoutingModule } from './connection-details-routing.module';

import { ConnectionDetailsPage } from './connection-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConnectionDetailsPageRoutingModule
  ],
  declarations: [ConnectionDetailsPage]
})
export class ConnectionDetailsPageModule {}
