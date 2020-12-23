import { Injectable } from "@angular/core";
import { AchievementsModel } from './achievements.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { DataStore } from '../../../shell/data-store';
import { GlobalService } from '../../../services/global.service';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { Observable } from 'rxjs';
import { UserProfileModel } from '../user-profile.model';
import { MapperService } from '../../../core/services/mapper/mapper.service';

@Injectable()

export class AchievementsService {
  private achievementsDataStore: DataStore<AchievementsModel>;
  private profileDataStore: DataStore<UserProfileModel>;

  constructor(private _mapperService: MapperService, private http: HttpClient, private globalService: GlobalService, private storage: Storage, private auth: AuthenticationService) { }

  getAchievementsDataSource(): Observable<AchievementsModel> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });
    const options = { headers: headers };

    const challengeAchievementEndpoint =
      this.globalService.apiUrl +
      'api/challenge/achievement';

    return this.http.get<AchievementsModel>(challengeAchievementEndpoint, options);
  }

  getAchievementsDataStore(dataSource: Observable<AchievementsModel>): DataStore<AchievementsModel> {
    // Use cache if available
    if (!this.achievementsDataStore) {
      // Initialize the model specifying that it is a shell model
      const shellModel: AchievementsModel = new AchievementsModel();
      this.achievementsDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this.achievementsDataStore.load(dataSource);
      this.globalService.refreshFlag.profile = false;
    }
    return this.achievementsDataStore;

  }
  getProfile() {
    const url =
      this.globalService.apiUrl +
      `/api/profile` +
      `?X-Api-Key=${this.globalService.getGlobalApiKey()}&X-Token=${this.auth.token}`;
    return this.http.get<UserProfileModel>(url);
  }
  getProfileDataStore(refresh: boolean = false) {
    // Use cache if available
    if (this.profileDataStore == undefined || refresh) {
      const shellModel: UserProfileModel = new UserProfileModel();
      this.profileDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this.profileDataStore.load(this.getProfile());
    }
    return this.profileDataStore;
  }

  getImage(filename: string) {
    const directory = `/award/${filename}`;

    return this._mapperService.mapImageUrl(directory);
  }
}
