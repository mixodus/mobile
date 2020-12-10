import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsResolver implements Resolve<any> {

  constructor(private _notificationsService: NotificationsService) { }

  resolve() {
    // Base Observable (where we get data from)
    return this._notificationsService.getDataStore(true);

  }
}
