import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  ) {
  }

  // data stores
  private _bannerDataStore: DataStore<EventsResponse>;
  private _singleDataStore: DataStore<EventsResponse>;
  private _listDataStore: DataStore<OnGoingEventListResponse>;
  private _listTypeDataStore: DataStore<EventsResponse>;
  private _profileDataStore: DataStore<UserProfileModel>;

  getProfile() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this._globalService.getGlobalApiKey(),
      'X-Token': `${this._auth.token}`
    });
    const options = { headers: headers };

    const profileEndpoint =
      this._globalService.apiUrl +
      'api/profile';

    return this._http.get<UserProfileModel>(profileEndpoint, options);
  }

  getBannerList() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this._globalService.getGlobalApiKey(),
      'X-Token': `${this._auth.token}`
    });

    const options = { headers: headers };

    const homeEventeEndpoint =
      this._globalService.apiUrl +
      'api/home_event';

    return this._http.get<EventsResponse>(homeEventeEndpoint, options);
  }

  getList() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this._globalService.getGlobalApiKey(),
      'X-Token': `${this._auth.token}`
    });

    const options = { headers: headers };

    const eventBootcampChallengeEndpoint =
      this._globalService.apiUrl +
      'api/event/all_ongoing';

    return this._http.get<OnGoingEventListResponse>(eventBootcampChallengeEndpoint, options);
  }

  getListType(event_type: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this._globalService.getGlobalApiKey(),
      'X-Token': `${this._auth.token}`
    });

    const options = { headers: headers };

    const eventTypeEndpoint =
      this._globalService.apiUrl +
      'api/event/event_type/' + event_type;

    return this._http.get<EventsResponse>(eventTypeEndpoint, options);
  }

  getSingle(id: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this._globalService.getGlobalApiKey(),
      'X-Token': `${this._auth.token}`
    });

    const options = { headers: headers };

    const detailEventEndpoint =
      this._globalService.apiUrl +
      'api/event/detail/' + id;

    return this._http.get<EventsResponse>(detailEventEndpoint, options);
  }

  register(data: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this._globalService.getGlobalApiKey(),
      'X-Token': `${this._auth.token}`
    });

    const body = data;

    const options = { headers: headers };

    const joinEventEndpoint =
      this._globalService.apiUrl +
      'api/event/join';

    return this._http.post<any>(joinEventEndpoint, body, options);
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
