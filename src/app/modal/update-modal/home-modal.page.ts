import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-example-modal',
  templateUrl: './home-modal.page.html',
  styleUrls: ['./home-modal.page.scss'],
})
export class HomeModalPage implements OnInit {

  modalTitle: string;
  modelId: number;
  title: string;
  message: string;

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
    const onClosedData: string = 'update message';
    await this.modalController.dismiss(onClosedData);
  }
}
