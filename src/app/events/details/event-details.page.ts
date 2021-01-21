import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../services/global.service';
import { EventDetailsModel } from './event-details.model';
import { EventDetailsResolver } from './Event-details.resolver';
import { LoadingController, NavController, ToastController, AlertController } from '@ionic/angular';
import { AuthenticationService } from '../../../app/services/auth/authentication.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./styles/event-details.page.scss', './styles/event-details.shell.scss'],
})
export class EventDetailsPage implements OnInit {
  details: EventDetailsResolver;
  default_place: string = 'Idstar';

  @HostBinding('class.is-shell') get isShell() {
    // return (this.details && this.details.isShell) ? true : false;
    return false;
  }

  @ViewChild('htmlDiv', { static: true }) simple;

  constructor(
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private router: Router,
    private http: HttpClient,
    private globalService: GlobalService,
    private navCtrl: NavController,
    private toast: ToastController,
    private alertCtrl: AlertController,
    private auth: AuthenticationService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.details = this.router.getCurrentNavigation().extras.state.data;
        let description = this.details.event_note;
        this.simple.nativeElement.innerHTML = this.globalService.decode(description);
      }
    });
  }

  ngOnInit(): void {}

  async confirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Are you sure want to join this event?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: (blah) => {
            this.join();
          },
        },
      ],
    });

    await alert.present();
  }

  async join() {
    let loading = await this.loadingCtrl.create();
    await loading.present();

    let dataPass = {
      event_id: this.details.event_id,
    };
    let token = this.auth.token;
    let url =
      this.globalService.getApiUrl() +
      'api/event/join?X-Api-Key=' +
      this.globalService.getGlobalApiKey() +
      '&X-Token=' +
      token;
    var headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Credentials', 'true');
    headers.append(
      'Access-Control-Allow-Headers',
      'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
    );

    this.http
      .post(url, dataPass, { headers: headers })
      .pipe(finalize(() => this.loadingCtrl.dismiss()))
      .subscribe(
        (data) => {
          this.presentToast(data['message']);
          this.globalService.refreshFlag.home = true;
          this.globalService.refreshFlag.jobApp = true;
          this.navCtrl.back();
        },
        (err) => {
          let message = '';
          if (err.error.message === undefined) message = 'Permasalahan jaringan, mohon coba lagi.';
          else message = err.error.message;

          this.presentToast(message);
        }
      );
  }
  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.back();
  }
}
