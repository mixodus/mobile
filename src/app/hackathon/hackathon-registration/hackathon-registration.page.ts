import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hackathon-registration',
  templateUrl: './hackathon-registration.page.html',
  styleUrls: ['./hackathon-registration.page.scss'],
})
export class HackathonRegistrationPage implements OnInit {

  constructor(
    private auth: AuthenticationService,
    private location: Location,
  ) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }

}
