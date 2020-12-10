import { Injectable } from '@angular/core';
import { JobDetailsModel } from './job-details.model';
import { DataStore } from '../../shell/data-store';
import { GlobalService } from '../../services/global.service';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobDetailService {

  private jobsDetailDataStore: DataStore<JobDetailsModel>;

  constructor(private http: HttpClient, private globalService: GlobalService, private auth: AuthenticationService) { }

  public getJobsDetailDataSource(job_id: string): Observable<JobDetailsModel> {
    let token = this.auth.token;
    let url = this.globalService.getApiUrl() + 'api/job_post/detail/' + job_id + '?X-Api-Key=' + this.globalService.getGlobalApiKey() + '&X-Token=' + token;
    return this.http.get<JobDetailsModel>(url);
    //return this.http.get<JobsModel>('./assets/sample-data/user/user-friends.json');
  }
  public getJobsDetailStore(dataSource: Observable<JobDetailsModel>): DataStore<JobDetailsModel> {

    if(this.globalService.refreshFlag.job_detail){
      // Initialize the model specifying that it is a shell model
      const shellModel: JobDetailsModel = new JobDetailsModel();
      this.jobsDetailDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this.jobsDetailDataStore.load(dataSource);
      this.globalService.refreshFlag.job_detail = false;
    }
    return this.jobsDetailDataStore;
  }
}
