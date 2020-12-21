import { Injectable } from '@angular/core';
import { JobDetailsModel } from './job-details.model';
import { DataStore } from '../../shell/data-store';
import { GlobalService } from '../../services/global.service';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewsResponse } from '../../core/models/news/NewsResponse';

@Injectable({
  providedIn: 'root'
})
export class JobDetailService {

  private jobsDetailDataStore: DataStore<JobDetailsModel>;

  constructor(private http: HttpClient, private globalService: GlobalService, private auth: AuthenticationService) { }

  public getJobsDetailDataSource(job_id: string): Observable<JobDetailsModel> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });
    const options = { headers: headers };

    const jobPostDetailEndpoint =
      this.globalService.apiUrl +
      'api/job_post/detail/' + job_id;

    return this.http.get<JobDetailsModel>(jobPostDetailEndpoint, options);

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
