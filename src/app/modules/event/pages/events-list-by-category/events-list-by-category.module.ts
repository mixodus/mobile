import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventsListByCategoryPage } from './events-list-by-category.page';
import { EventsListTypeResolver } from './event-list-by-category.resolver';
import { ShellModule } from '../../../../shell/shell.module';

const routes: Routes = [
  {
    path: '',
    component: EventsListByCategoryPage,
    resolve: {
      data: EventsListTypeResolver,
    },
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ShellModule
  ],
  declarations: [EventsListByCategoryPage],
  providers: [EventsListTypeResolver]
})
export class EventsListByCategoryPageModule {}
