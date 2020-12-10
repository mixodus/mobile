import { Injectable } from "@angular/core";
import { Resolve } from '@angular/router';
import { LevelService } from './level.service';

@Injectable()
export class LevelResolver implements Resolve<any> {

    constructor(private levelService: LevelService) {

    }

    resolve() {
        const dataSource = this.levelService.getLevelDataSource();
        const dataStore = this.levelService.getLevelStore(dataSource);
        return dataStore;
    }
    
}