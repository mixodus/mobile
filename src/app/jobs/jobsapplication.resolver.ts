import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { JobsService } from './jobs.service';
import { JobsApplicationModel } from './jobsapplication.model';
import { Observable } from 'rxjs';
import { DataStore } from '../shell/data-store';

@Injectable()
export class JobsApplicationResolver implements Resolve<any> {

  constructor(private jobsService: JobsService) { }

  resolve() {
    const dataSource: Observable<JobsApplicationModel> = this.jobsService.getJobsApplicationDataSource();
    const dataStore: DataStore<JobsApplicationModel> = this.jobsService.getJobsApplicationStore(dataSource);

    return dataStore;
  }
}
