import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-zoom-image-modal',
  templateUrl: './zoom-image-modal.component.html',
  styleUrls: ['./zoom-image-modal.component.scss'],
})
export class ZoomImageModalComponent implements OnInit {

  passedImage = null;

  constructor(private navParams: NavParams) { }

  ngOnInit() {
    this.passedImage = this.navParams.get('imageUrl');
  }

}
