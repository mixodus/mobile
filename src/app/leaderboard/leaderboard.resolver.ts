import { Injectable } from "@angular/core";
import { Resolve } from '@angular/router';
import { LeaderboardService } from './leaderboard.service';

@Injectable()
export class LeaderboardResolver implements Resolve<any> {
    constructor(private leaderboardService: LeaderboardService){}

    resolve(){
        const dataSource = this.leaderboardService.getLeaderboardDataSource();
        const dataStore = this.leaderboardService.getLeaderboardStore(dataSource);
        return dataStore;
    }
}