import { DataStore } from '../../../../app/shell/data-store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../../../app/services/global.service';
import { AuthenticationService } from '../../../../app/services/auth/authentication.service';
import { WorkExperienceModel } from './work-experiences.model';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { NewsResponse } from '../../../core/models/news/NewsResponse';

@Injectable({
    providedIn: 'root'
})

export class WorkExperienceService {
    private workExperienceDataStore: DataStore<WorkExperienceModel>;

    constructor(private http: HttpClient, private globalService: GlobalService, private storage: Storage, private auth: AuthenticationService) { }

    public getWorkExperienceDataSource() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Api-Key': this.globalService.getGlobalApiKey(),
            'X-Token': `${this.auth.token}`
        });
        const options = { headers: headers };

        const workExperienceEndpoint =
          this.globalService.apiUrl +
          'api/work_experience';

        return this.http.get<WorkExperienceModel>(workExperienceEndpoint, options);
    }

    public getWorkExperienceStore(dataSource: Observable<WorkExperienceModel>): DataStore<WorkExperienceModel> {
        // Use cache if available
        if (!this.workExperienceDataStore || this.globalService.refreshFlag.workExp) {
            // Initialize the model specifying that it is a shell model
            const shellModel: WorkExperienceModel = new WorkExperienceModel();
            this.workExperienceDataStore = new DataStore(shellModel);
            // Trigger the loading mechanism (with shell) in the dataStore
            this.workExperienceDataStore.load(dataSource);
        // } else {
        //     this.workExperienceDataStore.state.subscribe(val => {
        //         this.workExperienceDataStore = new DataStore(val);
        //         this.workExperienceDataStore.load(dataSource);
        //     })
            this.globalService.refreshFlag.workExp = false;
        }
        return this.workExperienceDataStore;
    }
}
