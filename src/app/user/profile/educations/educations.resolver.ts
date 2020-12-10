import { Injectable } from "@angular/core";
import { Resolve } from '@angular/router';
import { EducationService } from './educations.service';
import { GlobalService } from '../../../../app/services/global.service';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { DataStore } from '../../../../app/shell/data-store';
import { EducationModel } from './educations.model';

@Injectable()
export class EducationResolver implements Resolve<any> {
    token: string
    constructor(private educationService: EducationService, private globalService: GlobalService, private storage: Storage) {
    }

    resolve() {
        const dataSource: Observable<EducationModel> = this.educationService.getProjectDataSource();
        const dataStore: DataStore<EducationModel> = this.educationService.getProjectStore(dataSource);
        return dataStore;
    }
}