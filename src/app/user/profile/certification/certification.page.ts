import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { takeUntil, finalize } from 'rxjs/operators';
import { CertificationService } from './certification.service';
import { ShellModel } from '../../../shell/data-store';
import { CertificationResponse } from '../../../core/models/certification/CertificationResponse';
import { Subject } from 'rxjs';
import { NavController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { GlobalService } from '../../../services/global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../../../services/auth/authentication.service';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.page.html',
  styleUrls: ['./certification.page.scss'],
})
export class CertificationPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private auth: AuthenticationService,
    private http: HttpClient,
    private globalService: GlobalService,
    private toast: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public route: ActivatedRoute,
    public router: Router
  ) { }
  certif: CertificationResponse & ShellModel;
  certifData: any;
  countData: any;
  destroySubscription = new Subject<any>();
  ngOnInit() {
    this.route.data
    .pipe(takeUntil(this.destroySubscription)).subscribe((resolvedRouteData) => {
      const certificationDataStore = resolvedRouteData['data'];

      certificationDataStore.state.subscribe(
        (state) => {
          this.certif = state;
        },
        (error) => { }
      );
    },
      (error) => { });
  }
  ionViewWillLeave() {
    this.destroySubscription.next();
  }
  ionViewWillEnter() {
    this.fetchData();
  }
  fetchData() {
    this.route.data
      .pipe(takeUntil(this.destroySubscription)).subscribe((resolvedState) => {
        resolvedState.data.state.subscribe(
          (state) => {
            this.certif = state;
            console.log(this.certif);
            this.filterData();
            this.countData = this.certifData.length;
          },
          (err) => {
            console.log(err);
          }
        );
      });
  }
  filterData() {
    this.certifData = this.certif.data.filter((data) => {
      return data;
    })
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
            this.deleteCertification(confirmId)
          }
        }
      ]
    })

    await alert.present();
  }

  async deleteCertification(id) {
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

    const certificationEndpoint =
      this.globalService.apiUrl +
      'api/certification';

    this.http.delete(certificationEndpoint, options).pipe(
      finalize(() => this.loadingCtrl.dismiss())
    )
      .subscribe(data => {
        this.presentToast(data["message"]);
        this.globalService.refreshFlag.profile = true;
        this.globalService.refreshFlag.home = true;
        this.certif.data.splice(this.certif.data.findIndex(x => x.certification_id == id.id), 1);

        this.ionViewWillEnter();
      }, err => {
        console.log('JS Call error: ', err);
        
        let message = "";
        if (err.error.message === undefined)
        message = "Network problem, please try again !";
        else
        message = err.error.message;
        
        this.presentToast(message);
        this.ionViewWillEnter();
      });
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  goBack(){
    this.router.navigateByUrl('app/user');
  }

  goAdd(){
    this.router.navigateByUrl('app/user/certification/edit-certification')
  }
  editcertifDetail(id){
    let navigationExtras: NavigationExtras = {
      state: {
        data: this.certif.data.find(x => x.certification_id === id)
      }
    };
    this.navCtrl.navigateForward(['/app/user/certification/edit-certification'], navigationExtras);
 
  }
}
