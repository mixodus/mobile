import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { HackathonDetail } from '../../hackathonModel';
import { HackathonService } from '../../hackathon.service';
import { TermsConditionsService } from './terms-conditions.service';
import { TermsConditions } from './termsConditionModel';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss'],
})
export class TermsConditionsComponent implements OnInit {
  isTermsConditionsLoading: boolean;
  termsConditions: TermsConditions;

  constructor(
    private modalController: ModalController,
    private termsConditionsService: TermsConditionsService,
    private toastController: ToastController
  ) {
  }

  ngOnInit() {
    this.getTermsConditions();
  }

  doRefresh(ev) {
    this.getTermsConditions();

    ev.target.complete();
  }

  getTermsConditions() {
    this.isTermsConditionsLoading = true;
    this.termsConditionsService.getTermsConditions()
      .pipe(finalize(() => this.isTermsConditionsLoading = false)).subscribe((data: any) => {
      this.termsConditions = this.termsConditionsService.formattingTermsConditions(data.data);
    }, (err) => {
      let message = '';
      if (err.error.message === undefined) {
        message = 'Permasalahan jaringan, mohon coba lagi.';
      } else {
        message = err.error.message;
      }

      this.presentToast(message);
      this.isTermsConditionsLoading = false;
    });
  }

  handleButtonCloseClick() {
    this.modalController.dismiss();
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }
}
