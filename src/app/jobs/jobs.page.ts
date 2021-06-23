import { Component, OnInit, HostBinding, Renderer, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { initialJobsState, Jobs, JobsInterface, JobsModel } from './jobs.model';
import { NavController, ToastController, Platform, IonRefresher, LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../services/auth/authentication.service';
import { JobsApplicationModel } from './jobsapplication.model';
import { JobsService } from './jobs.service';
import { DataStore } from '../shell/data-store';
import { GlobalService } from '../services/global.service';
import { RoutingService } from '../routing.service';
import { Network } from '@ionic-native/network/ngx';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-friends',
  templateUrl: './jobs.page.html',
  styleUrls: [
    './styles/user-friends.page.scss',
    './styles/user-friends.shell.scss',
    './styles/user-friends.md.scss',
  ],
})
export class JobsPage implements OnInit {
  jobs: JobsInterface;
  searchedJobs: JobsInterface;

  toastCtrl: ToastController;

  jobApplicationList: JobsApplicationModel;

  // segmentValue = 'status';

  noSearch = true;
  selectedItem: String;
  hideSuggestion: boolean;
  searchHistory = [];
  // showFilters = false;
  // jobList: {}[];
  // jobSalariesList: {}[];
  destroySubscription = new Subject<any>();
  companyImg = 'assets/images/company.svg';
  lastRoute = null;
  toggleState = 0;

  @HostBinding('class.is-shell') get isShell() {
    return this.jobs && this.jobs.isShell;
  }

  // ion refresher
  @ViewChild(IonRefresher, { static: false })
  refresher: IonRefresher;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    public navCtrl: NavController,
    public globalService: GlobalService,
    private auth: AuthenticationService,
    private jobsService: JobsService,
    private routing: RoutingService,
    private renderer: Renderer,
    private platform: Platform,
    // private netService: NetworkServiceProviderService,
    public toast: ToastController,
    private network: Network,
    private loadingCtrl: LoadingController,
  ) {
  }

  ngOnInit() {
    this.route.data.subscribe(
      (resolvedRouteData) => {
        const jobsDataStore = resolvedRouteData['data'];
        jobsDataStore.state
          .subscribe(
            (response) => {
              this.jobs = this.formattingJobsResponse(response);
              console.log(this.jobs);
            },
            (error) => {
            }
          );
      },
      (error) => {
      }
    );
    this.route.data.subscribe(
      (resolvedRouteData) => {
        const dataJobApply = resolvedRouteData['dataJobApply'];
        dataJobApply.state.subscribe(
          (state) => {
            this.jobApplicationList = state;
            // console.log('jobApplicationList: ', this.jobApplicationList);
          },
          (error) => {
          }
        );
      },
      (error) => {
      }
    );
  }

  ionViewWillEnter(): void {
    this.refresher.disabled = false;

    if (this.auth.token) {
      this.auth.checkExpiredToken();
    }

    // create new destroyer
    this.destroySubscription = new Subject<any>();

    this.network
      .onConnect()
      .pipe(takeUntil(this.destroySubscription))
      .subscribe(() => {
        this.doRefresh(event);
      });

    this.platform.backButton.pipe(takeUntil(this.destroySubscription)).subscribe(() => {
      this.router.navigateByUrl(this.lastRoute);
    });

    // this.doRefresh();
  }

  async IonViewDidEnter() {
    await this.routing.preloadRoute('app/jobs');
  }

  ionViewDidLeave() {
    this.refresher.disabled = true;
    this.destroySubscription.next();
    this.destroySubscription.complete();
  }

  /**
   * Get job location string format.
   * @param province Job province.
   * @param country Job country.
   */
  getJobLocation(province: string, country: string) {
    if (province && country) {
      return `${province}, ${country}`;
    }

    return '';
  }

  /**
   * Get expiry date string format.
   * @param date Expiry date string
   */
  getJobExpiry(date: string) {
    if (date) {
      return `exp: ${date}`;
    }

    return '';
  }

  addToSearchHistory(item: String) {
    this.searchHistory.unshift(item);
    return this.searchHistory;
  }

  showSearchHistory() {
    this.hideSuggestion = false;
  }

  selectItem(item: String) {
    this.selectedItem = item;
  }

  onBlur(ev: any) {
    this.renderer.invokeElementMethod(ev.target, 'blur');
    this.hideSuggestion = true;
  }

  segmentChanged(ev): void {
    this.globalService.jobSegmentValue = ev.detail.value;
  }

  searchList(ev: any): void {
    const searchValue: string = ev.detail.value;

    if (searchValue.length >= 1) {
      this.filterSearch(searchValue);
      this.noSearch = false;
      this.addToSearchHistory(searchValue);
      this.hideSuggestion = true;
    } else if (searchValue.length <= 0) {
      this.noSearch = true;
      this.hideSuggestion = true;
    }
  }

  filterSearch(filter: string) {
    /**
     * create new model to show shell
     * get data source with filter
     * load datasource to datastore
     * subscribe datastore value to jobs
     */
    if (filter !== undefined && filter !== '') {
      const searchDataSource: Observable<JobsModel> = this.jobsService.getSearchDataSource(filter);
      const searchDataStore: DataStore<JobsModel> = this.jobsService.getSearchStore(
        searchDataSource
      );

      searchDataStore.state.subscribe(
        (state) => {
          this.searchedJobs = this.formattingJobsResponse(state);
        },
        (error) => {
        }
      );
    }
  }

  handleToggleJob(index: number) {
    this.toggleState = index;
  }

  getJobDetailDataSourceId(id) {
    if (id) {
      this.globalService.refreshFlag.job_detail = true;
      this.globalService.refreshFlag.profile = true;
      this.navCtrl.navigateForward(['/app/jobs/job-detail', id]);
    }
  }

  doRefresh(event?: any) {
    const jobsDataSource: Observable<JobsModel> = this.jobsService.getJobsDataSource();
    const jobsDataStore: DataStore<JobsModel> = this.jobsService.getJobsStore(jobsDataSource, true);
    const jobsApplicationDataSource: Observable<JobsApplicationModel> = this.jobsService.getJobsApplicationDataSource();
    const dataJobApply: DataStore<JobsApplicationModel> = this.jobsService.getJobsApplicationStore(
      jobsApplicationDataSource,
      true
    );

    this.loadingCtrl.create()
      .then((loadingEl) => {
        loadingEl.present();
        jobsDataStore.state.subscribe(
          (response) => {
            this.jobs = this.formattingJobsResponse(response);
            // console.log('this.jobs: ', this.jobs);
          },
          (error) => {
          }
        );

        dataJobApply.state.subscribe(
          (stateJobApplicationList) => {
            this.jobApplicationList = stateJobApplicationList;
            if (!stateJobApplicationList.isShell) {
              loadingEl.dismiss();
              if (event) {
                event.target.complete();
              }
            }
          },
          (error) => {
          }
        );
      });
  }

  formattingJobsResponse(response) {
    // console.log('response: ', response);

    return {
      status: response.status,
      message: response.message,
      data: !response.isShell ? this.formattingJobsData(response.data) : [initialJobsState],
      isShell: response.isShell
    };
  }

  formattingJobsData(unformattedJobsData) {
    const formattedJobsData: Jobs[] = [];

    for (const job of unformattedJobsData) {
      formattedJobsData.push(
        {
          jobId: job.job_id,
          companyName: job.company_name,
          jobTitle: job.job_title,
          designationName: job.designation_name,
          jobTypeName: job.job_type_name,
          jobVacancy: job.job_vacancy,
          dateOfClosing: job.date_of_closing,
          status: job.status,
          createdAt: job.createdAt,
          companyLogoUrl: job.company_logo_url,
          province: job.province,
          country: job.country
        }
      );
    }

    return formattedJobsData;
  }

  onBackClick() {
    this.navCtrl.navigateForward(['app/home']);
  }
}
