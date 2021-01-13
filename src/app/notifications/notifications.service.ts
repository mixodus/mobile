import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    if (this._auth.token) {
      const headers = new HttpHeaders({
        'X-Api-Key': this._globalService.getGlobalApiKey(),
        'X-Token': String(this._auth.token)
      });

      const options = { headers: headers };

      const notifUpdateReadEndpoint =
        this._globalService.apiUrl +
        'api/notif';

      return this._http.get<NotificationResponse>(notifUpdateReadEndpoint, options);
    } else {
      return null;
    }
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
    if (this._auth.token) {
      const headers = new HttpHeaders({
        'X-Api-Key': this._globalService.getGlobalApiKey(),
        'X-Token': String(this._auth.token)
      });

      const options = { headers: headers };

      const newNotifEndpoint =
        this._globalService.apiUrl +
        'api/notif/new_notif';

      return this._http.get(newNotifEndpoint, options);
    } else {
      return null;
    }
  }
}
