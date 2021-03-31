import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import {
  NavController,
  LoadingController,
  ToastController,
  ModalController,
  Platform,
} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../services/global.service';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from '../services/auth/authentication.service';
import { ReferralModel } from './referral.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ReferralModalPage } from './modal/referral-modal.page';
import { Observable } from 'rxjs';
import { DataStore } from '../shell/data-store';
import { ReferralService } from './referral.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.page.html',
  styleUrls: ['./styles/referral.page.scss', './styles/referral.shell.scss'],
})
export class ReferralPage implements OnInit {
  referralForm: FormGroup;
  referralList: ReferralModel;
  segmentValue = 'referral';
  maxFeeReferral: string = '0';
  validation_messages = {
    referral_name: [{ type: 'required', message: 'Nama Lengkap dibutuhkan.' }],
    referral_email: [
      { type: 'required', message: 'Email dibutuhkan.' },
      { type: 'pattern', message: 'Mohon masukkan Email dengan benar.' },
    ],
    referral_contact_no: [{ type: 'required', message: 'Nomor Telepon dibutuhkan.' }],
  };

  subscribe: any;
  selectedItem: any;
  hideSuggestion: boolean;
  noSearch: boolean;
  searchData: Array<object>;
  toggleState = 0;

  constructor(
    private navCtrl: NavController,
    private http: HttpClient,
    public globalService: GlobalService,
    private loadingCtrl: LoadingController,
    private toast: ToastController,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    public modalController: ModalController,
    public router: Router,
    private referralService: ReferralService,
    private platform: Platform,
    private location: Location
  ) {
    this.referralForm = new FormGroup({
      referral_name: new FormControl('', Validators.compose([Validators.required])),
      referral_email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      referral_contact_no: new FormControl(
        '',
        Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])
      ),
    });
  }

  ionViewWillEnter() {
    // this.initData();
    this.subscribe = this.platform.backButton.subscribe(() => {
      this.router.navigateByUrl('app/home');
    });
  }

  initData() {
    this.route.data.subscribe(
      (resolvedRouteData) => {
        const referralDataStore = resolvedRouteData['data'];
        referralDataStore.state.subscribe(
          (state) => {
            this.referralList = state;
          },
          (error) => {
          }
        );
      },
      (error) => {
      }
    );
  }

  ngOnInit() {
    this.initData();
    this.maxFeeReferral = this.globalService.maxFeeReferal;
  }

  handleToggleReferral(index: number) {
    this.toggleState = index;
    if (this.toggleState === 1) {
      this.doRefresh();
    }
  }

  segmentChanged(ev): void {
    this.globalService.referralSegmentValue = ev.detail.value;
    if (this.globalService.referralSegmentValue == 'status') {
      this.doRefresh();
    }
  }

  doRefresh() {
    const dataSource: Observable<ReferralModel> = this.referralService.getReferralDataSource();
    const dataStore: DataStore<ReferralModel> = this.referralService.getReferralDataStore(
      dataSource
    );

    dataStore.state.subscribe(
      (state) => {
        this.referralList = state;
        this.searchData = this.referralList.data;
      },
      (error) => {
      }
    );
  }

  onBlur(event: any) {
  }

  async doreferFriends() {
    let loading = await this.loadingCtrl.create();
    await loading.present();
    let token = this.auth.token;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });
    const options = { headers: headers };

    const referralEndpoint =
      this.globalService.apiUrl +
      'api/referral';

    let formData = this.referralForm.value;
    formData.referral_contact_no = '0' + formData.referral_contact_no;
    this.http
      .post(referralEndpoint, formData, options)
      .pipe(finalize(() => this.loadingCtrl.dismiss()))
      .subscribe(
        (data) => {
          //console.log('data referral: ', data);
          if (data['data'] !== undefined) {
            //console.log('data: ', data);
            this.referralList.data.unshift(data['data']);
            // this.openModal('Selamat!', data['message']);
            this.openModal('Selamat!', 'Anda berhasil mendaftarkan rujukan.');
            this.globalService.refreshFlag.referral = true;
          }
        },
        (err) => {
          let message = '';
          if (err.error.message === undefined) {
            message = 'Permasalahan jaringan, mohon coba lagi.';
          } else {
            message = err.error.message;
          }

          this.presentToast(message);
        }
      );
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  doreferFriends1() {
    this.openModal('Congratulations !!!', 'Testing doang');
  }

  async openModal(title, message) {
    const modal = await this.modalController.create({
      component: ReferralModalPage,
      componentProps: {
        title: title,
        message: message,
      },
    });

    modal.onDidDismiss().then((dataReturned) => {
      // this.router.navigate(['app/referral']);
      this.referralForm.reset();

      // this.navCtrl.back();
    });

    return await modal.present();
  }

  gotoWithdrawHistory() {
    const animationOptions = {
      animation: 'ios-transition',
      duration: 3000,
    };
    this.navCtrl.navigateForward(['/app/referral/withdraw-history']);
  }

  onBackClick() {
    this.navCtrl.navigateBack(['/app/home']);
  }

  searchList(ev: any): void {
    let searchValue: string = ev.detail.value;
    //console.log('ev: ', ev.detail.value);
    if (searchValue.length >= 1) {
      this.searchData = this.filterSearch(searchValue);
      this.noSearch = false;
      this.hideSuggestion = true;
    } else if (searchValue.length <= 0) {
      this.searchData = this.referralList.data;
      this.noSearch = true;
      this.hideSuggestion = true;
    }
  }

  filterSearch(word: String) {
    //console.log('word: ', word);
    if (word != undefined && word != '') {
      return this.referralList.data.filter((e) => {
        return e.referral_name.toLowerCase().indexOf(word.toLowerCase()) > -1;
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
