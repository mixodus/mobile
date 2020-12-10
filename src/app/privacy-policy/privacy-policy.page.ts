import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-privacy-policy-page',
  templateUrl: 'privacy-policy.page.html',
  styleUrls: [
    './styles/privacy-policy.page.scss'
  ]
})

export class PrivacyPolicyPage {

  constructor(private modalController: ModalController) {
  }

  handleButtonAcceptClick() {
    console.log('accept');
    this.modalController.dismiss();
  }

  handleButtonDeclineClick() {
    console.log('decline');
    this.modalController.dismiss();
  }

  handleButtonCloseClick() {
    this.modalController.dismiss();
  }
}
