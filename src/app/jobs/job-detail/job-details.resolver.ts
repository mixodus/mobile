import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { JobDetailService } from './job-detail.service';
import { JobDetailsModel } from './job-details.model';
import { Observable } from 'rxjs';
import { DataStore } from '../../shell/data-store';

@Injectable()
export class JobDetailsResolver implements Resolve<any> {

  long_description:string;
  constructor(private eventsService: JobDetailService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    const job_id = route.params['id'];
    const dataSource: Observable<JobDetailsModel> = this.eventsService.getJobsDetailDataSource(job_id);
    const dataStore: DataStore<JobDetailsModel> = this.eventsService.getJobsDetailStore(dataSource);

    return dataStore;
  }
}
