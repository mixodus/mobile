import { Injectable } from "@angular/core";
import { DataStore } from '../shell/data-store';
import { Observable } from 'rxjs';
import { ReferralModel } from './referral.model';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../services/global.service';
import { AuthenticationService } from '../services/auth/authentication.service';

@Injectable()

export class ReferralService {
    private referralDataStore: DataStore<ReferralModel>;

    constructor(private http: HttpClient, private globalService: GlobalService, private auth: AuthenticationService) {

    }
    public getReferralDataSource(): Observable<ReferralModel> {
        let token = this.auth.token;
        let url = this.globalService.getApiUrl() + 'api/referral?X-Api-Key=' + this.globalService.getGlobalApiKey() + '&X-Token=' + token;
        return this.http.get<ReferralModel>(url);
    }

    public getReferralDataStore(dataSource: Observable<ReferralModel>, refresh: boolean = false): DataStore<ReferralModel> {
        // Use cache if available
        if (!this.referralDataStore || this.globalService.refreshFlag.referral || refresh) {
            // Initialize the model specifying that it is a shell model
            const shellModel: ReferralModel = new ReferralModel();
            this.referralDataStore = new DataStore(shellModel);
            // Trigger the loading mechanism (with shell) in the dataStore
            this.referralDataStore.load(dataSource);
            this.globalService.refreshFlag.referral = false;
        }
        return this.referralDataStore;
    }
}