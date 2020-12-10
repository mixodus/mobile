import { Injectable } from "@angular/core";
import { DataStore } from '../shell/data-store';
import { LeaderboardModel } from './leaderboard.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../services/global.service';
import { AuthenticationService } from '../services/auth/authentication.service';
import { Storage } from '@ionic/storage';

@Injectable()
export class LeaderboardService {
    private leaderboardDataStore: DataStore<LeaderboardModel>;

    constructor(private http: HttpClient, private globalService: GlobalService, private storage: Storage, private auth: AuthenticationService) { }

    getLeaderboardDataSource(): Observable<LeaderboardModel> {
        let token = this.auth.token;

        let url = this.globalService.getApiUrl() + 'api/point/leaderboard_month?X-Api-Key=' + this.globalService.getGlobalApiKey() + '&X-Token=' + token;
        return this.http.get<LeaderboardModel>(url);
    }

    getLeaderboardStore(dataSource: Observable<LeaderboardModel>, refresh: boolean = false): DataStore<LeaderboardModel> {
        // Use cache if available
        if (!this.leaderboardDataStore || this.globalService.refreshFlag.leaderboard || refresh) {
            // Initialize the model specifying that it is a shell model
            const shellModel: LeaderboardModel = new LeaderboardModel();
            this.leaderboardDataStore = new DataStore(shellModel);
            // Trigger the loading mechanism (with shell) in the dataStore
            this.leaderboardDataStore.load(dataSource);
            this.globalService.refreshFlag.leaderboard = false;
        }
        return this.leaderboardDataStore;
    }
}