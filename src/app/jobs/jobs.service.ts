import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobsModel } from './jobs.model';
import { DataStore } from '../shell/data-store';
import { GlobalService } from '../services/global.service';
import { AuthenticationService } from '../services/auth/authentication.service';
import { JobsApplicationModel } from './jobsapplication.model';
import { API_ENDPOINTS } from '../core/constants/api-endpoints';
import { NewsResponse } from '../core/models/news/NewsResponse';

@Injectable()
export class JobsService {
  private jobsDataStore: DataStore<JobsModel>;
  private jobsApplicationDataStore: DataStore<JobsApplicationModel>;
  private searchedJobsDataStore: DataStore<JobsModel>;

  constructor(
    private http: HttpClient,
    private globalService: GlobalService,
    private auth: AuthenticationService
  ) {
  }

  public getJobsDataSource(): Observable<JobsModel> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });
    const options = { headers: headers };

    const jobPostEndpoint =
      this.globalService.getApiUrl() +
      '/api/job_post';

    return this.http.get<JobsModel>(jobPostEndpoint, options);


    // let token = this.auth.token;
    // let url =
    //   this.globalService.getApiUrl() +
    //   'api/job_post?X-Api-Key=' +
    //   this.globalService.getGlobalApiKey() +
    //   '&X-Token=' +
    //   token;
    // return this.http.get<JobsModel>(url);
  }

  public getJobsStore(
    dataSource: Observable<JobsModel>,
    refresh: boolean = false
  ): DataStore<JobsModel> {
    // Use cache if available
    if (!this.jobsDataStore || this.globalService.refreshFlag.job || refresh) {
      // Initialize the model specifying that it is a shell model
      const shellModel: JobsModel = new JobsModel();
      this.jobsDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this.jobsDataStore.load(dataSource);
      this.globalService.refreshFlag.job = false;
    }
    return this.jobsDataStore;
  }

  public getSearchDataSource(filter: string): Observable<JobsModel> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });
    const options = { headers: headers };

    const newsDetailEndpoint =
      this.globalService.apiUrl +
      'search/jobs' + '?q=' + filter;

    return this.http.get<JobsModel>(newsDetailEndpoint, options);
  }

  public getSearchStore(dataSource: Observable<JobsModel>): DataStore<JobsModel> {
    const shellModel: JobsModel = new JobsModel();
    this.searchedJobsDataStore = new DataStore(shellModel);
    // Trigger the loading mechanism (with shell) in the dataStore
    this.searchedJobsDataStore.load(dataSource);
    return this.searchedJobsDataStore;
  }

  public getJobsApplicationDataSource(): Observable<JobsApplicationModel> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });
    const options = { headers: headers };

    const jobPostApplicationEndpoint =
      this.globalService.apiUrl +
      'api/job_post/progress';

    return this.http.get<JobsApplicationModel>(jobPostApplicationEndpoint, options);
  }

  public getJobsApplicationStore(
    dataSource: Observable<JobsApplicationModel>,
    refresh: boolean = false
  ): DataStore<JobsApplicationModel> {
    // Use cache if available
    if (!this.jobsApplicationDataStore || this.globalService.refreshFlag.jobApp || refresh) {
      // Initialize the model specifying that it is a shell model
      const shellModel: JobsApplicationModel = new JobsApplicationModel();
      this.jobsApplicationDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this.jobsApplicationDataStore.load(dataSource);
      this.globalService.refreshFlag.jobApp = false;
    }
    return this.jobsApplicationDataStore;
  }
}
