import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';

import { EventDetailsPage } from './event-details.page';
import { EventDetailsResolver } from './Event-details.resolver';
import { EventsService } from '../events.service';
import { EventDetailsModel } from './event-details.model';

const routes: Routes = [
  {
    path: '',
    component: EventDetailsPage,
    resolve: {
      data: EventDetailsResolver
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
    EventDetailsPage
  ],
  providers: [
    EventDetailsModel,
    EventDetailsResolver,
    EventsService
  ]
})
export class EventDetailsPageModule {}
