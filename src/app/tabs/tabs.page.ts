import { Component } from '@angular/core';

import { MenuController } from '@ionic/angular';
import { NotificationsService } from '../notifications/notifications.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: [
    './styles/tabs.page.scss'
  ]
})
export class TabsPage {
  newNotifTotal = 0;
  isLoading = false;

  constructor(
    public menu: MenuController,
    public notificationsService: NotificationsService
  ) {
  }

  ionViewWillEnter() {
    this.menu.enable(true);
    this.getNewNotifications();
  }

  getNewNotifications() {
    this.isLoading = true;
    this.notificationsService.getNewNotifications().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe((state: any) => this.newNotifTotal = state.data);
  }
}
