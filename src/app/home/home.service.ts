import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/auth/authentication.service';
import { HomeModel } from './home.model';
import { DataStore } from '../shell/data-store';
import { GlobalService } from '../services/global.service';

@Injectable()
export class HomeService {
  public profileDataStore: DataStore<HomeModel>;

  constructor(private http: HttpClient, private globalService: GlobalService, private auth: AuthenticationService) {
  }

  public getProfileDataSource(): Observable<HomeModel> {
    const token = this.auth.token;
    const url = this.globalService.getApiUrl() + 'api/home?X-Api-Key=' + this.globalService.getGlobalApiKey() + '&X-Token=' + token;
    return this.http.get<HomeModel>(url);
  }

  public getProfileStore(dataSource: Observable<HomeModel>, refresh: boolean = false): DataStore<HomeModel> {
    var count = 0;
    // check apakah home perlu refresh 
    // jika tidak ambil datastore
    // Use cache if available
    if (!this.profileDataStore || this.globalService.refreshFlag.home || refresh) {
      // Initialize the model specifying that it is a shell model
      const shellModel: HomeModel = new HomeModel();
      this.profileDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this.profileDataStore.load(dataSource);
      this.globalService.refreshFlag.home = false;
    }
    count++;
    return this.profileDataStore;
  }
}
