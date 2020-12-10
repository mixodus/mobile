import { Injectable } from "@angular/core";
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DataStore } from '../../../../app/shell/data-store';
import { ProjectService } from './projects.service';
import { GlobalService } from '../../../../app/services/global.service';
import { Storage } from '@ionic/storage';
import { ProjectModel } from './projects.model';

@Injectable()
export class ProjectResolver implements Resolve<any> {
    token: string
    constructor(private projectService: ProjectService, private globalService: GlobalService, private storage: Storage) {
    }

    resolve() {
        const dataSource: Observable<ProjectModel> = this.projectService.getProjectDataSource();
        const dataStore: DataStore<ProjectModel> = this.projectService.getProjectStore(dataSource);
        return dataStore;
    }
}