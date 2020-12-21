import { DataStore } from '../../../../app/shell/data-store';
import { ProjectModel } from './projects.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Api-Key': this.globalService.getGlobalApiKey(),
            'X-Token': `${this.auth.token}`
        });
        const options = { headers: headers };

        const projectEndpoint =
          this.globalService.apiUrl +
          'api/project';

        return this.http.get<ProjectModel>(projectEndpoint, options);
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
