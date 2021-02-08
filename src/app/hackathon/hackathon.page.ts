import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AuthenticationService } from '../services/auth/authentication.service';

@Component({
  selector: 'app-hackathon',
  templateUrl: './hackathon.page.html',
  styleUrls: ['./hackathon.page.scss'],
})
export class HackathonPage implements OnInit {
  toggleState = 0;

  constructor(
    private auth: AuthenticationService,
    private location: Location
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
    // this.navCtrl.navigateForward(['app/events']);
  }

  handleToggleContent(index: number) {
    this.toggleState = index;
  }

}
