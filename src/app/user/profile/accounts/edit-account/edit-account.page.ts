import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../../../services/global.service';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.page.html',
  styleUrls: ['./edit-account.page.scss'],
})
export class EditAccountPage implements OnInit {
  editAccountForm : FormGroup;
  bankOptions: Array<String> = ['BNI', 'BCA', 'Bank Mandiri']
  constructor(
    private route : ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private globalService: GlobalService,
    private auth: AuthenticationService,
    private loadingCtrl: LoadingController,
    private toast: ToastController,
    private navCtrl: NavController
   ){
    
   }

  ngOnInit() {
    this.editAccountForm = new FormGroup({
      acc_name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50)
      ])),
      acc_number: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(15)
      ])),
      bank_name: new FormControl('', Validators.compose([
        Validators.required
      ]))
    })
  }
  customPopoverOption : any = {
    cssClass: 'option-full-width-edit-account',
    translucent: true,
    showBackdrop: false,
  }
  saveAccount(){
    this.navCtrl.back();
  }
  return_without_saving(){
    this.navCtrl.back();
  }
}
