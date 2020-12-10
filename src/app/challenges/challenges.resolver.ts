import { Injectable } from "@angular/core";
import { Resolve } from '@angular/router';
import { ChallengesService } from './challenges.service';

@Injectable()
export class ChallengesResolver implements Resolve<any> {
    constructor(private challengesService: ChallengesService) { }
    
    resolve() {
        const dataSource = this.challengesService.getChallengesDataSource();
        const dataStore = this.challengesService.getChallengesStore(dataSource);

        return dataStore;
    }
}