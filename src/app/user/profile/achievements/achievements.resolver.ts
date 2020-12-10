import { Injectable } from "@angular/core";
import { Resolve } from '@angular/router';
import { Storage } from '@ionic/storage';
import { UserService } from '../../user.service';
import { AchievementsModel } from './achievements.model';
import { Observable } from 'rxjs';
import { GlobalService } from '../../../services/global.service';
import { DataStore } from '../../../shell/data-store';
import { AchievementsService } from './achievements.service';

@Injectable()
export class AchievementsResolver implements Resolve<any>{

    constructor(private achievementsService: AchievementsService, private globalService : GlobalService, private storage : Storage) { }

    resolve(){
        const dataSource: Observable<AchievementsModel> = this.achievementsService.getAchievementsDataSource();
        const dataStore: DataStore<AchievementsModel> = this.achievementsService.getAchievementsDataStore(dataSource);
        return dataStore;
    }
}