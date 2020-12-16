import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalService } from '../services/global.service';
import { MapperService } from '../core/services/mapper/mapper.service';
import { AuthenticationService } from '../services/auth/authentication.service';
import { DataStore } from '../shell/data-store';
import { NotificationResponse } from '../core/models/notification/NotificationResponse';

@Injectable()
export class NotificationsService {
  constructor(
    private _http: HttpClient,
    private _globalService: GlobalService,
    private _mapperService: MapperService,
    private _auth: AuthenticationService
  ) {
  }

  private _NotifDataStore: DataStore<NotificationResponse>;


  public getData(): Observable<any> {
    const url =
      this._globalService.apiUrl +
      `api/notif` +
      `?X-Api-Key=${this._globalService.getGlobalApiKey()}&X-Token=${this._auth.token}`;

    return this._http.get<NotificationResponse>(url);
  }

  getDataStore(refresh: boolean = false) {
    // Use cache if available
    if (this._NotifDataStore == undefined || refresh) {
      const shellModel: NotificationResponse = new NotificationResponse();
      this._NotifDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this._NotifDataStore.load(this.getData());
    }
    return this._NotifDataStore;
  }

  getNewNotifications() {
    const url =
      this._globalService.apiUrl +
      `api/notif/new_notif` +
      `?X-Api-Key=${this._globalService.getGlobalApiKey()}&X-Token=${this._auth.token}`;

    console.log('this._http.get(url): ', this._http.get(url));

    return this._http.get(url);
  }
}
