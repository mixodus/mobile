import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthenticationService } from '../services/auth/authentication.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-hackathon',
  templateUrl: './hackathon.page.html',
  styleUrls: ['./hackathon.page.scss'],
})
export class HackathonPage implements OnInit {
  toggleState = 0;

  constructor(
    private auth: AuthenticationService,
    private location: Location,
    private alertCtrl: AlertController
  ) {
  }

  ngOnInit() {
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
            console.log('ke Registrasi')
            // this.navCtrl.navigateForward(['/app/jobs']);
          },
        },
      ],
    });

    await alert.present();
  }
}
