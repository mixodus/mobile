import { Injectable } from '@angular/core';
import { DataStore } from '../shell/data-store';
import { LevelModel } from './level.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../services/global.service';
import { AuthenticationService } from '../services/auth/authentication.service';
import { Storage } from '@ionic/storage';

@Injectable()
export class LevelService {
  private levelDataStore: DataStore<LevelModel>;

  constructor(private http: HttpClient, private globalService: GlobalService, private storage: Storage, private auth: AuthenticationService) {

  }

  getLevelDataSource(): Observable<LevelModel> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });

    const options = { headers: headers };

    const levelEndpoint =
      this.globalService.apiUrl +
      'api/level';

    return this.http.get<LevelModel>(levelEndpoint, options);
  }

  getLevelStore(dataSource: Observable<LevelModel>, refresh: boolean = false): DataStore<LevelModel> {
    // Use cache if available
    if (!this.levelDataStore || this.globalService.refreshFlag.level || refresh) {
      // Initialize the model specifying that it is a shell model
      const shellModel: LevelModel = new LevelModel();
      this.levelDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this.levelDataStore.load(dataSource);
      this.globalService.refreshFlag.level = false;
    }
    return this.levelDataStore;
  }
}
