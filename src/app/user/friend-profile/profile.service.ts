import { Injectable } from '@angular/core';
import { DataStore } from '../../shell/data-store';
import { FriendProfileModel } from './profile.model';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { Observable } from 'rxjs';

@Injectable()
export class FriendProfileService {
  private friendProfileDataStore: DataStore<FriendProfileModel>;

  constructor(private http: HttpClient, private globalService: GlobalService, private storage: Storage, private auth: AuthenticationService) {
  }

  getFriendProfileDataSource(userId): Observable<FriendProfileModel> {
    let token = this.auth.token;

    let url = this.globalService.getApiUrl() + 'api/profile/friend/' + userId + '?X-Api-Key=' + this.globalService.getGlobalApiKey() + '&X-Token=' + token;

    return this.http.get<FriendProfileModel>(url);
    // return this.http.get<UserProfileModel>('./assets/sample-data/user/user-profile.json');

  }

  public getFriendProfileStore(dataSource: Observable<FriendProfileModel>): DataStore<FriendProfileModel> {
    // Use cache if available
    if (!this.friendProfileDataStore) {
      // Initialize the model specifying that it is a shell model
      const shellModel: FriendProfileModel = new FriendProfileModel();
      this.friendProfileDataStore = new DataStore(shellModel);
    }
    // Trigger the loading mechanism (with shell) in the dataStore
    this.friendProfileDataStore.load(dataSource);
    return this.friendProfileDataStore;
  }
}
