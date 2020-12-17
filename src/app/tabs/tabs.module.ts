import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { FriendProfileResolver } from '../user/friend-profile/profile.resolver';
import { FriendProfileService } from '../user/friend-profile/profile.service';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { NotificationsService } from '../notifications/notifications.service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage],
  providers: [
    NotificationsService
  ]
})
export class TabsPageModule {
}
