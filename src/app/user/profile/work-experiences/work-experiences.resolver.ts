import { Injectable } from "@angular/core";
import { Resolve } from '@angular/router';
import { WorkExperienceService } from './work-experiences.service';
import { GlobalService } from '../../../../app/services/global.service';
import { Observable } from 'rxjs';
import { DataStore } from '../../../../app/shell/data-store';
import { WorkExperienceModel } from './work-experiences.model';
import { Storage } from '@ionic/storage';

@Injectable()

export class WorkExperienceResolver implements Resolve<any> {
    token: String;
    constructor(private workExperienceService: WorkExperienceService, private globalService: GlobalService, private storage: Storage) {
    }

    resolve() {
        const dataSource: Observable<WorkExperienceModel> = this.workExperienceService.getWorkExperienceDataSource();
        const dataStore: DataStore<WorkExperienceModel> = this.workExperienceService.getWorkExperienceStore(dataSource);
        return dataStore;
    }
}