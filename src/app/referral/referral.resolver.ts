import { Injectable } from "@angular/core";
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DataStore } from '../shell/data-store';
import { ReferralModel } from './referral.model';
import { ReferralService } from './referral.service';

@Injectable()

export class ReferralResolver implements Resolve<any>{

    constructor(private referralService: ReferralService) {

    }
    resolve() {
        const dataSource: Observable<ReferralModel> = this.referralService.getReferralDataSource();
        const dataStore: DataStore<ReferralModel> = this.referralService.getReferralDataStore(dataSource);

        return dataStore;
    }
}