import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/auth/authentication.service';

@Component({
  selector: 'app-restricted-interface',
  templateUrl: './restricted-interface.component.html',
  styleUrls: ['./restricted-interface.component.scss'],
})
export class RestrictedInterfaceComponent implements OnInit {

  constructor(private auth: AuthenticationService,) { }

  ngOnInit() {
  }

  handleLoginButtonClick() {
    this.auth.signOut();
  }
}
