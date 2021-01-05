import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { WorkExperienceModel } from './work-experiences.model';
import { NavController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../../../../app/services/auth/authentication.service';
import { GlobalService } from '../../../../app/services/global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Network } from '@ionic-native/network/ngx';
import { Observable } from 'rxjs';
import { DataStore } from '../../../shell/data-store';
import { WorkExperienceService } from './work-experiences.service';

@Component({
  selector: 'app-work-experiences',
  templateUrl: './work-experiences.page.html',
  styleUrls: [
    './styles/work-experiences.page.scss',
    './styles/work-experiences.shell.scss',],
})
export class WorkExperiencesPage implements OnInit {

  workExperience: WorkExperienceModel;
  subscribe: any;
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
    private router: Router
  ) {
  }

  @HostBinding('class.is-shell') get isShell() {
    return (this.workExperience && this.workExperience.isShell) ? true : false;
  }

  ngOnInit(): void {
    this.route.data.subscribe((resolvedRouteData) => {
        const workExperienceDataStore = resolvedRouteData['data'];

        workExperienceDataStore.state.subscribe(
          (state) => {
            this.workExperience = state;
          },
          (error) => {
          }
        );
      },
      (error) => {
      });
  }

  ionViewWillEnter(): void {
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      const dataSource: Observable<WorkExperienceModel> = this.workExperienceService.getWorkExperienceDataSource();
      const dataStore: DataStore<WorkExperienceModel> = this.workExperienceService.getWorkExperienceStore(dataSource);
      dataStore.state.subscribe((state) => {
          this.workExperience = state;
          for (let index = 0; index < this.workExperience.data.length; index++) {
            const start_date = new Date(this.workExperience.data[index].start_period);
            const format_start_date = start_date.toLocaleString('default', { month: 'short', year: 'numeric' });
            this.workExperience.data[index].start_period = format_start_date;
            const end_date = new Date(this.workExperience.data[index].end_period);
            const format_end_date = end_date.toLocaleString('default', { month: 'short', year: 'numeric' });
            this.workExperience.data[index].end_period = format_end_date;
          }
        },
        (error) => {
        }
      );
    });
  }

  ionViewDidLeave() {
    this.connectSubscription.unsubscribe();
  }

  async deleteAlert(deleteId) {

    const alert = await this.alertCtrl.create({
      header: 'Hapus',
      message: 'Apakah Anda yakin ingin menghapus?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ya',
          handler: () => {
            let confirmId = { id: deleteId };

            this.deleteExperience(confirmId);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteExperience(id) {
    let loading = await this.loadingCtrl.create();
    await loading.present();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });

    const body = {id: id};

    const options = { headers: headers, body: body };

    const workExperienceEndpoint =
      this.globalService.apiUrl +
      'api/work_experience';

    this.http.delete(workExperienceEndpoint, options).pipe(
      finalize(() => this.loadingCtrl.dismiss())
    )
      .subscribe(data => {
        this.presentToast(data['message']);
        this.globalService.refreshFlag.profile = true;
        this.globalService.refreshFlag.home = true;
        this.workExperience.data.splice(this.workExperience.data.findIndex(x => x.work_experience_id == id.id), 1);
      }, err => {
        console.log('JS Call error: ', err);

        let message = '';
        if (err.error.message === undefined) {
          message = 'Network problem, please try again !';
        } else {
          message = err.error.message;
        }

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

  editWorkExperienceDetail(id) {
    let navigationExtras: NavigationExtras = {
      state: {
        data: this.workExperience.data.find(x => x.work_experience_id === id)
      }
    };
    this.navCtrl.navigateForward(['/app/user/work-experiences/edit-work-experience'], navigationExtras);

  }

  goBack() {
    this.router.navigateByUrl('app/user');
  }
}
