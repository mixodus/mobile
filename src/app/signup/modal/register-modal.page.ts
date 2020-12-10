import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-example-modal',
  templateUrl: './register-modal.page.html',
  styleUrls: ['./register-modal.page.scss'],
})
export class RegisterModalPage implements OnInit {

  modalTitle: string;
  modelId: number;
  title: string;
  messageA: string;
  messageB: string;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private router: Router
  ) {
  }

  ngOnInit() {
    console.table(this.navParams);
    this.modelId = this.navParams.data.paramID;
    this.modalTitle = this.navParams.data.paramTitle;
  }

  async closeModal() {
    const onClosedData = 'login';
    await this.modalController.dismiss(onClosedData);
    // this.router.parseUrl('/auth/login');
  }
}
