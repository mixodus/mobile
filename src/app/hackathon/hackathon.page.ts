import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthenticationService } from '../services/auth/authentication.service';
import { AlertController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { HackathonService } from './hackathon.service';
import { HackathonDetail } from './hackathonModel';
import { HackathonRegistrationService } from './hackathon-registration/hackathon-registration.service';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-hackathon',
  templateUrl: './hackathon.page.html',
  styleUrls: ['./hackathon.page.scss'],
})
export class HackathonPage implements OnInit {
  toggleState = 0;
  isHackathonDetailLoading: boolean;
  hackathonDetail: HackathonDetail;
  url: SafeResourceUrl;
  public showMe = false

  constructor(
    private auth: AuthenticationService,
    private hackathonService: HackathonService,
    private hackathonRegistrationService: HackathonRegistrationService,
    private location: Location,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private domSatizer: DomSanitizer,
  ) {
  }

  ngOnInit() {
    this.getHackathonDetail();
    this.url = this.domSatizer.bypassSecurityTrustResourceUrl("https://icstar.oneindonesia.id/");
  }

  doRefresh(ev) {
    this.getHackathonDetail();
    ev.target.complete();
  }

  getHackathonDetail() {
    this.isHackathonDetailLoading = true;
    this.hackathonService.getHackathonDetailData()
      .pipe(finalize(() => this.isHackathonDetailLoading = false)).subscribe((data: any) => {
      this.hackathonDetail = this.hackathonService.formattingHackathonDetail(data.data);
      console.log('hackathonDetail: ', this.hackathonDetail);
      this.hackathonRegistrationService.setEventId(data.data.event_id);
    }, (err) => {
      let message = '';
      if (err.error.message === undefined) {
        message = 'Permasalahan jaringan, mohon coba lagi.';
      } else {
        message = err.error.message;
      }

      this.presentToast(message);
      this.isHackathonDetailLoading = false;
    });
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  ionViewWillEnter() {
    if (this.auth.token) {
      this.auth.checkExpiredToken();
    }
    this.getHackathonDetail();
  }

  goBack() {
    this.location.back();
  }

  handleToggleContent(index: number) {
    this.toggleState = index;
  }

  async presentRegisAlert() {
    const alert = await this.alertCtrl.create({
      message: `<div class="message-body">
                    <p class="title">Oops!</p>
                    <p class="content">
                    Anda harus registrasi akun terlebih dahulu
                    agar dapat mengikuti hackathon ini!</p>
                </div>`,
      cssClass: 'idstar-custom-alert',
      buttons: [
        {
          cssClass: 'idstar-custom-alert-action',
          text: 'Registrasi Sekarang',
          handler: () => {
            console.log('ke Registrasi');
            // this.navCtrl.navigateForward(['/app/jobs']);
          },
        },
      ],
    });

    await alert.present();
  }

  handleLoginButtonClick() {
    this.auth.signOut();
  }

  handleScheduleDropDownClick(index) {
    console.log('index: ', index);

    const cloneSchedule = [...this.hackathonDetail.schedules];
    const toUpdatedObject = cloneSchedule[index];

    const updatedObject = Object.assign({} , toUpdatedObject, {
      isDescriptionOpen: !toUpdatedObject.isDescriptionOpen
    });

    this.hackathonDetail.schedules = [
      ...this.hackathonDetail.schedules.slice(0, index),
      updatedObject,
      ...this.hackathonDetail.schedules.slice(index + 1)
    ];
  }
}
