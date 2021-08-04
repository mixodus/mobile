import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiscoverConnectionPageRoutingModule } from './discover-connection-routing.module';

import { DiscoverConnectionPage } from './discover-connection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiscoverConnectionPageRoutingModule
  ],
  declarations: [DiscoverConnectionPage]
})
export class DiscoverConnectionModule {}
