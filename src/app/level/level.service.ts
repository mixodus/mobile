import { Injectable } from "@angular/core";
import { DataStore } from '../shell/data-store';
import { LevelModel } from './level.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../services/global.service';
import { AuthenticationService } from '../services/auth/authentication.service';
import { Storage } from '@ionic/storage';

@Injectable()
export class LevelService {
    private levelDataStore: DataStore<LevelModel>;

    constructor(private http: HttpClient, private globalService: GlobalService, private storage: Storage, private auth: AuthenticationService) {

    }

    getLevelDataSource(): Observable<LevelModel> {
        let token = this.auth.token;

        let url = this.globalService.getApiUrl() + 'api/level?X-Api-Key=' + this.globalService.getGlobalApiKey() + '&X-Token=' + token;
        return this.http.get<LevelModel>(url);
    }

    getLevelStore(dataSource: Observable<LevelModel>, refresh:boolean = false): DataStore<LevelModel> {
        // Use cache if available
        if (!this.levelDataStore || this.globalService.refreshFlag.level || refresh) {
            // Initialize the model specifying that it is a shell model
            const shellModel: LevelModel = new LevelModel();
            this.levelDataStore = new DataStore(shellModel);
            // Trigger the loading mechanism (with shell) in the dataStore
            this.levelDataStore.load(dataSource);
            this.globalService.refreshFlag.level = false
        }
        return this.levelDataStore;
    }
}