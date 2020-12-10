import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../../services/global.service';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { EventsResponse, OnGoingEventListResponse } from '../../../core/models/event/EventResponse';
import { DataStore } from '../../../shell/data-store';
import { MapperService } from '../../../core/services/mapper/mapper.service';
import { UserProfileModel } from '../../../user/profile/user-profile.model';

@Injectable()
export class EventsService {
  constructor(
    private _http: HttpClient,
    private _globalService: GlobalService,
    private _mapperService: MapperService,
    private _auth: AuthenticationService
    ) {}
    
    // data stores
    private _bannerDataStore: DataStore<EventsResponse>;
    private _singleDataStore: DataStore<EventsResponse>;
    private _listDataStore: DataStore<OnGoingEventListResponse>;
    private _listTypeDataStore: DataStore<EventsResponse>;
    private _profileDataStore: DataStore<UserProfileModel>;

  getProfile() {
    const url =
      this._globalService.apiUrl +
      `/api/profile` +
      `?X-Api-Key=${this._globalService.getGlobalApiKey()}&X-Token=${this._auth.token}`;
    return this._http.get<UserProfileModel>(url);
  }
  getBannerList() {
    const url =
      this._globalService.apiUrl +
      '/api/home_event' +
      `?X-Api-Key=${this._globalService.getGlobalApiKey()}&X-Token=${this._auth.token}`;

    return this._http.get<EventsResponse>(url);
  }

  getList() {
    const url =
      this._globalService.apiUrl +
      'api/event/all_ongoing' +
      `?X-Api-Key=${this._globalService.getGlobalApiKey()}&X-Token=${this._auth.token}`;

    return this._http.get<OnGoingEventListResponse>(url);
  }
  getListType(event_type: string) {
    const url =
      this._globalService.apiUrl +
      `api/event/event_type/${event_type}` +
      `?X-Api-Key=${this._globalService.getGlobalApiKey()}&X-Token=${this._auth.token}`;

    return this._http.get<EventsResponse>(url);
  }

  getSingle(id: string) {
    const url =
      this._globalService.apiUrl +
      `api/event/detail/${id}` +
      `?X-Api-Key=${this._globalService.getGlobalApiKey()}&X-Token=${this._auth.token}`;

    return this._http.get<EventsResponse>(url);
  }

  register(data: any) {
    const url =
      this._globalService.apiUrl +
      `api/event/join` +
      `?X-Api-Key=${this._globalService.getGlobalApiKey()}&X-Token=${this._auth.token}`;

    return this._http.post<any>(url, data);
  }

  /**
   * Get event image.
   * @param filename filename
   */
  getEventImage(filename: string) {
    const directory = `/event/${filename}`;

    return this._mapperService.mapImageUrl(directory);
  }
  // getChallengeImage(filename: string) {
  //   const directory = `/challenge/${filename}`;

  //   return this._mapperService.mapImageUrl(directory);
  // }

  getSingleDataStore(id: string, refresh: boolean = false) {
    // Use cache if available
    if (this._singleDataStore == undefined || refresh) {
      const shellModel: EventsResponse = new EventsResponse();
      this._singleDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this._singleDataStore.load(this.getSingle(id));
    }
    return this._singleDataStore;
  }

  getBannerDataStore(refresh: boolean = false) {
    // Use cache if available
    if (this._bannerDataStore == undefined || refresh) {
      const shellModel: EventsResponse = new EventsResponse();
      this._bannerDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this._bannerDataStore.load(this.getBannerList());
    }
    return this._bannerDataStore;
  }

  getListDataStore(refresh: boolean = false) {
    // Use cache if available
    if (this._listDataStore == undefined || refresh) {
      const shellModel: OnGoingEventListResponse = new OnGoingEventListResponse();
      this._listDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this._listDataStore.load(this.getList());
    }
    return this._listDataStore;
  }
  getListTypeDataStore(event_type: string, refresh: boolean = false) {
    // Use cache if available
    if (this._listTypeDataStore == undefined || refresh) {
      const shellModel: EventsResponse = new EventsResponse();
      this._listTypeDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this._listTypeDataStore.load(this.getListType(event_type));
    }
    return this._listTypeDataStore;
  }
  getProfileDataStore(refresh: boolean = false) {
    // Use cache if available
    if (this._profileDataStore == undefined || refresh) {
      const shellModel: UserProfileModel = new UserProfileModel();
      this._profileDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this._profileDataStore.load(this.getProfile());
    }
    return this._profileDataStore;
  }
}
