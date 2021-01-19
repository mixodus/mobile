import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../services/global.service';
import { Observable } from 'rxjs';
import { UserProfileModel } from './profile/user-profile.model';
// import { UserFriendsModel } from './community/user-friends.model';
import { DataStore } from '../shell/data-store';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../services/auth/authentication.service';
import { NewsResponse } from '../core/models/news/NewsResponse';

@Injectable()
export class UserService {
  private profileDataStore: DataStore<UserProfileModel>;
  // private friendsDataStore: DataStore<UserFriendsModel>;
  // private friendSearchDataStore: DataStore<UserFriendsModel>;

  constructor(private http: HttpClient, private globalService: GlobalService,
              private storage: Storage, private auth: AuthenticationService) {
  }

  getProfileDataSource(): Observable<UserProfileModel> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Api-Key': this.globalService.getGlobalApiKey(),
        'X-Token': `${this.auth.token}`
      });
      const options = { headers: headers };

      const profileEndpoint =
        this.globalService.apiUrl +
        'api/profile';

      return this.http.get<UserProfileModel>(profileEndpoint, options);
  }

  public getProfileStore(dataSource: Observable<UserProfileModel>, refresh: boolean = false): DataStore<UserProfileModel> {
    // Use cache if available
    if (!this.profileDataStore || this.globalService.refreshFlag.profile || refresh) {
      // Initialize the model specifying that it is a shell model
      const shellModel: UserProfileModel = new UserProfileModel();
      this.profileDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this.profileDataStore.load(dataSource);
      this.globalService.refreshFlag.profile = false;
    }
    return this.profileDataStore;
  }
}
