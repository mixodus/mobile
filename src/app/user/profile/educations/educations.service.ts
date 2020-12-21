import { DataStore } from '../../../../app/shell/data-store';
import { EducationModel } from './educations.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../../../app/services/global.service';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../../../../app/services/auth/authentication.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EducationService {
    private educationDataStore: DataStore<EducationModel>

    constructor(private http: HttpClient, private globalService: GlobalService, private storage: Storage, private auth: AuthenticationService) { }

    public getProjectDataSource() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Api-Key': this.globalService.getGlobalApiKey(),
            'X-Token': `${this.auth.token}`
        });
        const options = { headers: headers };

        const educationEndpoint =
          this.globalService.apiUrl +
          'api/education';

        return this.http.get<EducationModel>(educationEndpoint, options);
    }

    public getProjectStore(dataSource: Observable<EducationModel>): DataStore<EducationModel> {
        // Use cache if available
        if (!this.educationDataStore || this.globalService.refreshFlag.education) {
            // Initialize the model specifying that it is a shell model
            const shellModel: EducationModel= new EducationModel();
            this.educationDataStore = new DataStore(shellModel);
            // Trigger the loading mechanism (with shell) in the dataStore
            this.educationDataStore.load(dataSource);
        // } else {
        //     this.educationDataStore.state.subscribe(val => {
        //         this.educationDataStore = new DataStore(val);
        //         this.educationDataStore.load(dataSource);
        //     })
        this.globalService.refreshFlag.education = false;
        }
        return this.educationDataStore;
    }
}
