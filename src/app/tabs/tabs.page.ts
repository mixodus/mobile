import { Component } from '@angular/core';

import { MenuController } from '@ionic/angular';
import { NotificationsService } from '../notifications/notifications.service';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '../services/auth/authentication.service';

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
    public notificationsService: NotificationsService,
    public auth: AuthenticationService
  ) {
  }

  ionViewWillEnter() {
    this.menu.enable(true);
    if(this.auth.token) {
      this.getNewNotifications();
    }
  }

  getNewNotifications() {
    this.isLoading = true;
    this.notificationsService.getNewNotifications().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe((state: any) => this.newNotifTotal = state.data);
  }
}
