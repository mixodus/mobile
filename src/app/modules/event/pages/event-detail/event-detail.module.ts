import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../../../components/components.module';

import { EventDetailPage } from './event-detail.page';
import { EventDetailResolver } from './event-detail.resolver';
// import { EventsService } from '../events.service';
import { EventDetailsModel } from './event-detail.model';

const routes: Routes = [
  {
    path: '',
    component: EventDetailPage,
    resolve: {
      data: EventDetailResolver,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    HttpClientModule,
  ],
  declarations: [EventDetailPage],
  providers: [EventDetailsModel, EventDetailResolver],
})
export class EventDetailPageModule {}
