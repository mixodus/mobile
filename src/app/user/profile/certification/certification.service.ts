import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { GlobalService } from '../../../services/global.service';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { HttpClient } from '@angular/common/http';
import { CertificationResponse } from '../../../core/models/certification/CertificationResponse';
import { DataStore } from '../../../shell/data-store';

@Injectable()
export class CertificationService {
    constructor(
        public globalService : GlobalService,
        public auth : AuthenticationService,
        public http : HttpClient
    ){}
    public certifDataStore : DataStore<CertificationResponse>;
    public getData(): Observable<any>{
        const url =
        this.globalService.apiUrl + 
        `api/certification` +
        `?X-Api-Key=${this.globalService.getGlobalApiKey()}&X-Token=${this.auth.token}`;
        return this.http.get<CertificationResponse>(url);
    }
    getDataStore(refresh: boolean = false){
        if(this.certifDataStore == undefined || refresh){
            const shellModel: CertificationResponse = new CertificationResponse();
            this.certifDataStore = new DataStore(shellModel);
            this.certifDataStore.load(this.getData());
        }
        return this.certifDataStore;
    }
    register(data: any) {
        const url =
          this.globalService.apiUrl +
          `api/certification` +
          `?X-Api-Key=${this.globalService.getGlobalApiKey()}&X-Token=${this.auth.token}`;
    
        return this.http.post<any>(url, data);
    }
}