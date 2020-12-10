import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ChallengesService } from '../challenges.service';

@Injectable()
export class ChallengeDetailResolver implements Resolve<any> {

    constructor(private challengesService: ChallengesService) { }

    resolve(route: ActivatedRouteSnapshot) {
        const challenge_id = route.params['id'];
        const dataSource = this.challengesService.getChallengeDetailDataSource(challenge_id)
        const dataStore = this.challengesService.getChallengeDetailStore(dataSource);

        return dataStore;
    }
}