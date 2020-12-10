import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { EducationModel } from './educations.model';
import { NavController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../../../../app/services/auth/authentication.service';
import { GlobalService } from '../../../../app/services/global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { EducationService } from './educations.service';
import { Network } from '@ionic-native/network/ngx';
import { Observable } from 'rxjs';
import { DataStore } from '../../../shell/data-store';

@Component({
  selector: 'app-educations',
  templateUrl: './educations.page.html',
  styleUrls: [
    './styles/educations.page.scss',
    './styles/educations.shell.scss',
  ],
})
export class EducationsPage implements OnInit {

  education: EducationModel
  connectSubscription: any

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
    private educationService: EducationService,
    private router: Router
  ) { }

  @HostBinding('class.is-shell') get isShell() {
    return (this.education && this.education.isShell) ? true : false;
  }

  ngOnInit(): void {
    this.route.data.subscribe((resolvedRouteData) => {
      const educationDataStore = resolvedRouteData['data'];

      educationDataStore.state.subscribe(
        (state) => {
          this.education = state;
        },
        (error) => { }
      );
    },
      (error) => { });
  }

  ionViewWillEnter(): void {
    this.connectSubscription = this.network.onConnect().subscribe(() => {
      const dataSource: Observable<EducationModel> = this.educationService.getProjectDataSource();
      const dataStore: DataStore<EducationModel> = this.educationService.getProjectStore(dataSource);
      dataStore.state.subscribe(
        (state) => {
          this.education = state;
        },
        (error) => { }
      );
    })
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

          }
        }, {
          text: 'Ya',
          handler: () => {
            let confirmId = { id: deleteId }
            this.deleteEducation(confirmId)
          }
        }
      ]
    })

    await alert.present();
  }

  async deleteEducation(id) {
    let loading = await this.loadingCtrl.create();
    await loading.present();
    let token = this.auth.token;

    let url = this.globalService.getApiUrl() + 'api/education?X-Api-Key=' + this.globalService.getGlobalApiKey() + '&X-Token=' + token;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: id
    };

    this.http.delete(url, options).pipe(
      finalize(() => this.loadingCtrl.dismiss())
    )
      .subscribe(data => {
        this.presentToast(data["message"]);
        this.globalService.refreshFlag.profile = true;
        this.globalService.refreshFlag.home = true;
        this.education.data.splice(this.education.data.findIndex(x => x.qualification_id == id.id), 1);
      }, err => {
        console.log('JS Call error: ', err);

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

  editEducationDetail(id) {
    let navigationExtras: NavigationExtras = {
      state: {
        data: this.education.data.find(x => x.qualification_id === id)
      }
    };
    this.navCtrl.navigateForward(['/app/user/educations/edit-education'], navigationExtras);
  }
  goBack(){
    this.router.navigateByUrl('app/user');
  }
}
