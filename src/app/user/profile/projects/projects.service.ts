import { DataStore } from '../../../../app/shell/data-store';
import { ProjectModel } from './projects.model';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../../../app/services/global.service';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../../../../app/services/auth/authentication.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ProjectService {
    private projectDataStore: DataStore<ProjectModel>

    constructor(private http: HttpClient, private globalService: GlobalService, private storage: Storage, private auth: AuthenticationService) { }

    public getProjectDataSource() {
        let token = this.auth.token;

        let url = this.globalService.getApiUrl() + 'api/project?X-Api-Key=' + this.globalService.getGlobalApiKey() + '&X-Token=' + token;
        return this.http.get<ProjectModel>(url);
    }

    public getProjectStore(dataSource: Observable<ProjectModel>): DataStore<ProjectModel> {
        // Use cache if available
        if (!this.projectDataStore || this.globalService.refreshFlag.project) {
            // Initialize the model specifying that it is a shell model
            const shellModel: ProjectModel= new ProjectModel();
            this.projectDataStore = new DataStore(shellModel);
            // Trigger the loading mechanism (with shell) in the dataStore
            this.projectDataStore.load(dataSource);
        // } else {
        //     this.projectDataStore.state.subscribe(val => {
        //         this.projectDataStore = new DataStore(val);
        //         this.projectDataStore.load(dataSource);
        //     })
        this.globalService.refreshFlag.project = false;
        }
        return this.projectDataStore;
    }
}