import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { JobsService } from './jobs.service';
import { JobsModel } from './jobs.model';
import { Observable } from 'rxjs';
import { DataStore } from '../shell/data-store';

@Injectable()
export class JobsResolver implements Resolve<any> {

  constructor(private jobService: JobsService) { }

  resolve() {
    const dataSource: Observable<JobsModel> = this.jobService.getJobsDataSource();
    const dataStore: DataStore<JobsModel> = this.jobService.getJobsStore(dataSource);
    return dataStore;
  }
}
