import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.page.html',
  styleUrls: ['./withdraw.page.scss'],
})
export class WithdrawPage implements OnInit {
  withdrawReferralForm: FormGroup;
  selectedItem: any;
  accountName : Array<{id: number, name: string,num: number,bank: string}> = [{
    id : 1,
    name : "M. Rizqiko Harliano",
    num : 2001920291,
    bank : "BCA"
  },
  {
    id : 2,
    name : "M. Rizqiko Harliano",
    num : 2810985901,
    bank : "BNI"
  }
  ];
  constructor(public toastCtrl: ToastController, public router: Router, public globalService : GlobalService) { }

  ngOnInit() {
    this.selectedItem = this.accountName[0];
    this.withdrawReferralForm = new FormGroup({
      account : new FormControl('', Validators.compose([

      ])),
      amount : new FormControl('', Validators.compose([

      ])),
      password : new FormControl('', Validators.compose([

      ])),
    })
  }
  customPopoverOptions : any = {
    cssClass: 'option-full-width-province',
    translucent: true,
    showBackdrop: false
  }
  compareAccount(a1, a2){
    return a1.id === a2.id;
  }
  async submit(){
    let toast = await this.toastCtrl.create({
      message : "Your withdraw request will be reviewed. Later we will give you notification regarding the request status",
      duration : 2000
    })
    this.router.navigateByUrl('app/referral');
    this.globalService.referralSegmentValue = 'withdraw';
    toast.present();
  }
}
