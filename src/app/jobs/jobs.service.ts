import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JobsModel } from './jobs.model';
import { DataStore } from '../shell/data-store';
import { GlobalService } from '../services/global.service';
import { AuthenticationService } from '../services/auth/authentication.service';
import { JobsApplicationModel } from './jobsapplication.model';

@Injectable()
export class JobsService {
  private jobsDataStore: DataStore<JobsModel>;
  private jobsApplicationDataStore: DataStore<JobsApplicationModel>;
  private searchedJobsDataStore: DataStore<JobsModel>;

  constructor(
    private http: HttpClient,
    private globalService: GlobalService,
    private auth: AuthenticationService
  ) {}

  public getJobsDataSource(): Observable<JobsModel> {
    let token = this.auth.token;
    let url =
      this.globalService.getApiUrl() +
      'api/job_post?X-Api-Key=' +
      this.globalService.getGlobalApiKey() +
      '&X-Token=' +
      token;
    return this.http.get<JobsModel>(url);
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
    let token = this.auth.token;
    let url =
      this.globalService.getApiUrl() +
      'search/jobs?X-Api-Key=' +
      this.globalService.getGlobalApiKey() +
      '&X-Token=' +
      token +
      '&q=' +
      filter;
    return this.http.get<JobsModel>(url);
  }

  public getSearchStore(dataSource: Observable<JobsModel>): DataStore<JobsModel> {
    const shellModel: JobsModel = new JobsModel();
    this.searchedJobsDataStore = new DataStore(shellModel);
    // Trigger the loading mechanism (with shell) in the dataStore
    this.searchedJobsDataStore.load(dataSource);
    return this.searchedJobsDataStore;
  }

  public getJobsApplicationDataSource(): Observable<JobsApplicationModel> {
    let token = this.auth.token;
    let url =
      this.globalService.getApiUrl() +
      'api/job_post/progress?X-Api-Key=' +
      this.globalService.getGlobalApiKey() +
      '&X-Token=' +
      token;
    return this.http.get<JobsApplicationModel>(url);
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
