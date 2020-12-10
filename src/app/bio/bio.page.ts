import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/auth/authentication.service';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './bio.page.html',
  styleUrls: ['./styles/bio.page.scss'],
})
export class BioPage implements OnInit {
  public countriesArray: { code: string; name: string }[];
  public provinceArray: Array<string>;

  createProfileForm: FormGroup;
  hideSuggestion: boolean;
  profile: any;
  value: string;
  message: string;
  selectedItem: string;
  items: Array<string>;
  isItemAvailable: boolean;
  signupForm: FormGroup;

  validation_messages = {
    country: [{ type: 'required', message: 'Negara dibutuhkan.' }],
    province: [{ type: 'required', message: 'Provinsi dibutuhkan.' }],

    // 'preferred_specialization': [
    //   { type: 'required', message: 'Specialization is required.' },
    //   { type: 'min', message: 'Specialization must be 5 or more'}
    // ],

    expected_salary: [
      { type: 'required', message: 'Gaji dibutuhkan' },
      { type: 'pattern', message: 'Gaji harus berupa angka.' },
    ],
    start_work_year: [{ type: 'required', message: 'Tahun dibutuhkan.' }],
    summary: [{ type: 'required', message: 'Tentang Saya dibutuhkan.' }],
  };

  constructor(
    private toast: ToastController,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private globalService: GlobalService,
    private storage: Storage,
    public fb: FormBuilder,
    private auth: AuthenticationService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.countriesArray = this.globalService.countriesArr;
    this.provinceArray = this.globalService.provinceArr;
    this.value = 'exp';
    this.hideSuggestion = false;
    this.isItemAvailable = false;

    this.createProfileForm = this.fb.group({
      job_title: [''],
      currency_salary: ['', Validators.required],
      expected_salary: ['', [Validators.required, Validators.pattern('^[.0-9]*')]],
      country: ['', Validators.required],
      province: ['', Validators.required],
      start_work_year: [''],
      summary: [''],
    });

    this.createProfileForm.controls['job_title'].setValue('');
    this.createProfileForm.controls['currency_salary'].setValue('');
    this.createProfileForm.controls['expected_salary'].setValue('');
    this.createProfileForm.controls['country'].setValue('');
    this.createProfileForm.controls['province'].setValue('');
    this.createProfileForm.controls['start_work_year'].setValue('');
    this.createProfileForm.controls['summary'].setValue('');
  }
  eventHandler(event: any) {
    if (event.keyCode > 57) {
      this.createProfileForm.controls['expected_salary'].setValue('');
    }
  }
  convertSalary(amount: string) {
    // amount = amount.includes('0');
    // if(amount !== ''){
    //   if(parseInt(amount)){
    //     this.createProfileForm.controls['expected_salary'].setValue(parseInt(amount).toLocaleString());
    //   }else{
    //     amount = ''
    //     this.createProfileForm.controls['expected_salary'].setValue(amount);
    //   }
    // }
    // for(let i = 0; i < amount.toLocaleString.length; i++){
    //   if(i % 3 === 0){
    //     this.createProfileForm.controls['expected_salary'].setValue(amount);
    //     this.createProfileForm.controls['expected_salary'].setValue(',');
    //     console.log(this.createProfileForm.get['expected_salary'].value);
    //   }else{
    //     this.createProfileForm.controls['expected_salary'].setValue(amount);
    //     console.log(this.createProfileForm.get['expected_salary'].value);
    //   }
    let newString = amount.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    this.createProfileForm.controls['expected_salary'].setValue(newString);
    console.log(this.createProfileForm.controls['expected_salary'].value);
  }
  editSalaryValue(amount: string) {
    // let newString = amount.replace(/\B(?=(\.))/g, '');
    let newString = amount.replace(/[.]/g, '');
    this.createProfileForm.controls['expected_salary'].setValue(newString);
    console.log(this.createProfileForm.controls['expected_salary'].value);
  }
  getEmployeeStatus(ev) {
    if (ev.checked) {
      this.value = 'fresh';
    } else {
      this.value = 'exp';
    }
  }

  selectItem(item) {
    this.selectedItem = item;
    this.hideSuggestion = true;
    return item;
  }

  getSpecialization(ev: any) {
    const val = ev.target.value;

    if (val && val.trim() != '') {
      this.isItemAvailable = true;
      this.items = this.items.filter((item) => {
        return item.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
      if (val == '') {
        this.isItemAvailable = false;
      }
    }
  }

  async submit() {
    let postData = this.createProfileForm.value;

    postData.expected_salary = postData.expected_salary.replace(/\./g, '');

    if (this.value == 'fresh') {
      postData.job_title = 'Fresh Graduate';
      postData.start_work_year = '';
    }
    if (postData.expected_salary === '0') {
      this.presentToast('Expected Salary cannot be 0');
      return;
    }

    // change date selected into year only
    const year = new Date(postData.start_work_year);
    postData.start_work_year = year.getFullYear().toString();

    console.log(postData);

    var headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    let loading = await this.loadingCtrl.create();
    await loading.present();
    let token = this.auth.token;
    let url =
      this.globalService.getApiUrl() +
      'api/profile/complete_bio?X-Api-Key=' +
      this.globalService.getGlobalApiKey() +
      '&X-Token=' +
      token;

    this.http
      .post(url, postData)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(
        (data) => {
          this.presentToast(data['message']);
          this.globalService.refreshFlag.home = true;
          this.globalService.refreshFlag.profile = true;

          this.storage.get(this.globalService.getTokenName()).then((data) => {
            let newSessionUser = data;
            newSessionUser.user.job_title = postData.job_title;
            this.storage.set(this.globalService.getTokenName(), newSessionUser);
            this.navCtrl.navigateForward(['app/home']);
          });
        },
        (err) => {
          let message = '';
          if (err.error.message === undefined) message = 'Permasalahan jaringan, mohon coba lagi.';
          else message = err.error.message;

          this.presentToast(message);
        }
      );
    // this.router.navigate(['app/categories']);
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }
}
