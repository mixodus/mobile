import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.page.html',
  styleUrls: ['./popover.page.scss'],
 
})
export class PopoverPage implements OnInit {

  constructor(
    private popoverCtrl: PopoverController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
  }

  friendList(){
    this.navParams.data.homeRef.friendList();
    this.popoverCtrl.dismiss();
  }
  friendReqList(){
    this.navParams.data.homeRef.friendReqList();
    this.popoverCtrl.dismiss();
  }
  editProfile(){
    this.navParams.data.homeRef.editProfile();
    this.popoverCtrl.dismiss();
  }
}
