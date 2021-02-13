import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthenticationService } from '../services/auth/authentication.service';
import { AlertController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { HackathonService } from './hackathon.service';
import { HackathonDetail } from './hackathonModel';

@Component({
  selector: 'app-hackathon',
  templateUrl: './hackathon.page.html',
  styleUrls: ['./hackathon.page.scss'],
})
export class HackathonPage implements OnInit {
  toggleState = 0;
  isHackathonDetailLoading: boolean;
  hackathonDetail: HackathonDetail;

  constructor(
    private auth: AuthenticationService,
    private hackathonService: HackathonService,
    private location: Location,
    private alertCtrl: AlertController,
    private toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.getHackathonDetail();
  }

  getHackathonDetail() {
    this.isHackathonDetailLoading = true;
    this.hackathonService.getHackathonDetailData()
      .pipe(finalize(() => this.isHackathonDetailLoading = false)).subscribe((data: any) => {
      this.hackathonDetail = this.hackathonService.formattingHackathonDetail(data.data);
      console.log('data: ', data);
      console.log('this.hackathonDetail: ', this.hackathonDetail);
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
}
