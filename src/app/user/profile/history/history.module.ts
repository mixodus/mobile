import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HistoryPage } from './history.page';
import { BootcampComponent } from './tabs/bootcamp/bootcamp.component';
import { EventComponent } from './tabs/event/event.component';
import { ChallengeComponent } from './tabs/challenge/challenge.component';
import { EventResolver } from './event.resolver';
import { ChallengeResolver } from './challenge.resolver';
import { HistoryService } from './history.service';
const routes: Routes = [
  {
    path: '',
    // resolve:{
    //   event: EventResolver,
    //   challenge: ChallengeResolver
    // },
    component: HistoryPage,
    children: [
      {
        path: 'bootcamp/:event_type',
        component: BootcampComponent,
        resolve: {
          event: EventResolver
        }
      },
      {
        path: 'event/:event_type',
        component: EventComponent,
        resolve: {
          event: EventResolver
        }
      },
      {
        path: 'challenge',
        component: ChallengeComponent,
        resolve: {
          challenge: ChallengeResolver
        }
      },
    ],
  },
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [HistoryPage, BootcampComponent, ChallengeComponent, EventComponent],
  providers: [EventResolver, ChallengeResolver, HistoryService]
})
export class HistoryPageModule {}
