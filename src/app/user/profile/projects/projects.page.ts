import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ProjectModel } from './projects.model';
import { NavController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { WorkExperienceModel } from '../work-experiences/work-experiences.model';
import { finalize } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../../../app/services/global.service';
import { AuthenticationService } from '../../../../app/services/auth/authentication.service';
import { Network } from '@ionic-native/network/ngx';
import { Observable } from 'rxjs';
import { DataStore } from '../../../shell/data-store';
import { WorkExperienceService } from '../work-experiences/work-experiences.service';
import { ProjectService } from './projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: [
    './styles/projects.page.scss',
    './styles/projects.shell.scss',
  ],
})
export class ProjectsPage implements OnInit {

  project: ProjectModel
  workExperience: WorkExperienceModel
  connectSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private http: HttpClient,
    private globalService: GlobalService,
    private auth: AuthenticationService,
    private toast: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private network: Network,
    private workExperienceService: WorkExperienceService,
    private projectService: ProjectService,
    private router: Router,
  ) { }

  @HostBinding('class.is-shell') get isShell() {
    return (this.project && this.project.isShell) ? true : false;
  }

  ngOnInit(): void {
    this.route.data.subscribe((resolvedRouteData) => {
      const projectDataStore = resolvedRouteData['data'];
      const workDataStore = resolvedRouteData['special'];

      projectDataStore.state.subscribe(
        (state) => {
          this.project = state;
        },
        (error) => {}
      );
      workDataStore.state.subscribe(
        (state) => {
          this.workExperience = state;
        },
        (error) => {}
      );
    },
    (error) => {});
    
  }

  ionViewWillEnter(): void {
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      const dataSource: Observable<ProjectModel> = this.projectService.getProjectDataSource();
      const dataStore: DataStore<ProjectModel> = this.projectService.getProjectStore(dataSource);
      dataStore.state.subscribe((state) => {
        this.project = state;
      },
        (error) => { }
      );
      const dataSourceSpecial: Observable<WorkExperienceModel> = this.workExperienceService.getWorkExperienceDataSource();
      const dataStoreSpecial: DataStore<WorkExperienceModel> = this.workExperienceService.getWorkExperienceStore(dataSourceSpecial);
      dataStoreSpecial.state.subscribe((state) => {
        this.workExperience = state;
      },
        (error) => { }
      );
    })
  }
  ionViewDidLeave() {
    this.connectSubscription.unsubscribe();
  }

  async deleteAlert(deleteId){
   
    
    const alert = await this.alertCtrl.create({
      header: 'Hapus',
      message: 'Apakah Anda yakin ingin menghapus?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ya',
          handler: () => {
            let confirmId = {id: deleteId}
            
            this.deleteProject(confirmId)
          }
        }
      ]
    })

    await alert.present();
  }

  async deleteProject(id){
    let loading = await this.loadingCtrl.create();
    await loading.present();
    let token = this.auth.token;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });

    const body = {id: id};

    const options = { headers: headers, body: body };

    const workExperienceEndpoint =
      this.globalService.apiUrl +
      'api/project';


    this.http.delete(workExperienceEndpoint, options).pipe(
      finalize(() => this.loadingCtrl.dismiss())
    )
      .subscribe(data => {
        this.presentToast(data["message"]);
        this.globalService.refreshFlag.profile = true;
        this.globalService.refreshFlag.home = true;
        this.project.data.splice(this.project.data.findIndex(x => x.id == id.id), 1);
      }, err => {
       
        let message = "";
        if (err.error.message === undefined)
          message = "Permasalahan jaringan, mohon coba lagi.";
        else
          message = err.error.message;

        this.presentToast(message);
      });
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  editProjectDetailWithoutId(){
    let navigationExtras : NavigationExtras = {
      state:{
        workId: this.workExperience.data
      }
    };
    this.navCtrl.navigateForward(['/app/user/projects/edit-project'], navigationExtras);
  }

  editProjectDetail(id){
    let navigationExtras : NavigationExtras = {
      state:{
        data: this.project.data.find(x => x.id === id),
        workId: this.workExperience.data
      }
    };
    this.navCtrl.navigateForward(['/app/user/projects/edit-project'], navigationExtras);
  }

  goBack(){
    this.router.navigateByUrl('app/user');
  }
}
