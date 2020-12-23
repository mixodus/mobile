import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../../services/global.service';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { DataStore } from '../../../shell/data-store';
import { MapperService } from '../../../core/services/mapper/mapper.service';
import { EventHistoryResponse, ChallengeHistoryResponse } from './HistoryResponse';

@Injectable()
export class HistoryService {
    constructor(
        private _http: HttpClient,
        private _globalService: GlobalService,
        private _mapperService: MapperService,
        private _auth: AuthenticationService
    ) { }

    // data stores
    private _EventDataStore: DataStore<EventHistoryResponse>;
    private _ChallengeDataStore: DataStore<ChallengeHistoryResponse>;

    getEvent(event_type: string) {
        const url =
            this._globalService.apiUrl +
            `api/event/history/${event_type}` +
            `?X-Api-Key=${this._globalService.getGlobalApiKey()}&X-Token=${this._auth.token}`;

        return this._http.get<EventHistoryResponse>(url);
    }
    getChallenge() {
        const headers = new HttpHeaders({
            'X-Api-Key': this._globalService.getGlobalApiKey(),
            'X-Token': `${this._auth.token}`
        });
        const options = { headers: headers };

        const historyChallengeEndpoint =
          this._globalService.apiUrl +
          'api/challenge/history';

        return this._http.get<ChallengeHistoryResponse>(historyChallengeEndpoint, options);
    }
    getEventImage(filename: string) {
        const directory = `/event/${filename}`;

        return this._mapperService.mapImageUrl(directory);
    }
    getChallengeImage(filename: string) {
        const directory = `/challenge/${filename}`;

        return this._mapperService.mapImageUrl(directory);
    }
    getEventDataStore(event_type: string, refresh: boolean = false) {
        // Use cache if available
        if (this._EventDataStore == undefined || refresh) {
            const shellModel: EventHistoryResponse = new EventHistoryResponse();
            this._EventDataStore = new DataStore(shellModel);
            // Trigger the loading mechanism (with shell) in the dataStore
            this._EventDataStore.load(this.getEvent(event_type));
        }
        return this._EventDataStore;
    }
    getChallengeDataStore(refresh: boolean = false) {
        // Use cache if available
        if (this._ChallengeDataStore == undefined || refresh) {
            const shellModel: ChallengeHistoryResponse = new ChallengeHistoryResponse();
            this._ChallengeDataStore = new DataStore(shellModel);
            // Trigger the loading mechanism (with shell) in the dataStore
            this._ChallengeDataStore.load(this.getChallenge());
        }
        return this._ChallengeDataStore;
    }

}
