import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventsListPage } from './events-list.page';
import { EventsListResolver } from './resolver/events-list.resolver';
import { EventsBannerListResolver } from './resolver/events-banner-list.resolver';
import { ShellModule } from '../../../../shell/shell.module';

const routes: Routes = [
  {
    path: '',
    component: EventsListPage,
    resolve: {
      banner: EventsBannerListResolver,
      events: EventsListResolver,
    },
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, ShellModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [EventsListPage],
  providers: [EventsListResolver, EventsBannerListResolver],
})
export class EventsListPageModule {}
