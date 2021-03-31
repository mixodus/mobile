import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../../../../app/services/global.service';
import { AuthenticationService } from '../../../../../app/services/auth/authentication.service';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-work-experience',
  templateUrl: './edit-work-experience.page.html',
  styleUrls: [
    './styles/edit-work-experience.page.scss',
  ],
})
export class EditWorkExperiencePage implements OnInit {

  editExperienceForm: FormGroup;
  data: any;
  currentlyWork = false;
  isSubmitted = false;

  validation_messages = {
    'description': [
      { type: 'required', message: 'Deskripsi dibutuhkan.' },
      { type: 'minlength', message: 'Deskripsi minimal 20 karakter.' }
    ]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private globalService: GlobalService,
    private auth: AuthenticationService,
    private loadingCtrl: LoadingController,
    private toast: ToastController,
    private navCtrl: NavController
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.data;
      }
    });
  }

  ngOnInit() {
    this.editExperienceForm = new FormGroup({
      id: new FormControl('', Validators.compose([
        //
      ])),
      company_name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      post: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      start_period_month: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      start_period_year: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      end_period_month: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      end_period_year: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(20),
      ])),
    });
    if (this.data == null) {
      return;
    }
    this.editExperienceForm.controls['id'].setValue(this.data.work_experience_id);
    this.editExperienceForm.controls['company_name'].setValue(this.data.company_name);
    this.editExperienceForm.controls['post'].setValue(this.data.post);
    this.editExperienceForm.controls['start_period_month'].setValue(this.data.start_period);
    this.editExperienceForm.controls['start_period_year'].setValue(this.data.start_period);
    if (new Date(this.data.end_period).getFullYear() === 9999) {
      this.currentlyWork = true;
    } else {
      this.editExperienceForm.controls['end_period_month'].setValue(this.data.end_period);
      this.editExperienceForm.controls['end_period_year'].setValue(this.data.end_period);
    }
    this.editExperienceForm.controls['description'].setValue(this.data.description);
    this.onChangeCheckbox();
  }

  onChangeCheckbox() {
    if (this.currentlyWork) {
      this.editExperienceForm.controls['end_period_month'].disable();
      this.editExperienceForm.controls['end_period_year'].disable();
    } else {
      this.editExperienceForm.controls['end_period_month'].enable();
      this.editExperienceForm.controls['end_period_year'].enable();
    }
  }


  async saveWorkExperience(event) {
    event.stopPropagation();
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if (!this.editExperienceForm.valid || this.validDate()) {
      this.presentToast('Mohon isi semua data yang dibutuhkan dengan benar.');
      loading.dismiss();
      return;
    }

    const formData = this.editExperienceForm.value;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });
    const options = { headers: headers };

    const workExperienceEndpoint =
      this.globalService.apiUrl +
      'api/work_experience';

    if (this.data == null) {
      let addData: any = {};
      addData = {
        company_name: formData.company_name,
        post: formData.post,
        start_period_month: new Date(formData.start_period_month).toLocaleString('default', { month: '2-digit' }),
        start_period_year: new Date(formData.start_period_year).toLocaleString('default', { year: 'numeric' }),
        description: formData.description,
      };
      if (this.currentlyWork === true) {
        addData.end_period_month = '12';
        addData.end_period_year = '9999';
      } else {
        addData.end_period_month = new Date(formData.end_period_month).toLocaleString('default', { month: '2-digit' });
        addData.end_period_year = new Date(formData.end_period_year).toLocaleString('default', { year: 'numeric' });
      }

      this.http.post(workExperienceEndpoint, addData, options).pipe(
        finalize(() => this.loadingCtrl.dismiss())
      )
        .subscribe(data => {
          this.presentToast(data['message']);
          this.globalService.refreshFlag.workExp = true;
          this.globalService.refreshFlag.profile = true;
          this.globalService.refreshFlag.home = true;
          this.globalService.refreshFlag.level = true;
          this.globalService.refreshFlag.leaderboard = true;
          this.navCtrl.back();
        }, err => {
          //console.log('JS Call error: ', err);

          let message = '';
          if (err.error.message === undefined) {
            message = 'Permasalahan jaringan, mohon coba lagi.';
          } else {
            message = err.error.message;
          }

          this.presentToast(message);
        });
      return;
    }

    // convert start month
    formData.start_period_month = new Date(formData.start_period_month).toLocaleString('default', { month: '2-digit' });
    // convert start year
    formData.start_period_year = new Date(formData.start_period_year).toLocaleString('default', { year: 'numeric' });
    // convert end month
    if (this.currentlyWork) {
      formData.end_period_month = 12;
    } else {
      formData.end_period_month = new Date(formData.end_period_month).toLocaleString('default', { month: '2-digit' });
    }
    // convert end year
    if (this.currentlyWork) {
      formData.end_period_year = 9999;
    } else {
      formData.end_period_year = new Date(formData.end_period_year).toLocaleString('default', { year: 'numeric' });
    }


    this.http.put(workExperienceEndpoint, formData, options).pipe(
      finalize(() => this.loadingCtrl.dismiss())
    )
      .subscribe(data => {
        this.presentToast(data['message']);
        this.globalService.refreshFlag.workExp = true;
        this.globalService.refreshFlag.profile = true;
        this.navCtrl.back();
      }, err => {
        //console.log('JS Call error: ', err);

        let message = '';
        if (err.error.message === undefined) {
          message = 'Permasalahan jaringan, mohon coba lagi.';
        } else {
          message = err.error.message;
        }

        this.presentToast(message);
      });
  }

  validDate(): boolean {
    if (!this.currentlyWork && this.editExperienceForm.controls['end_period_month'].value != '' &&
      this.editExperienceForm.controls['end_period_year'].value != '' &&
      this.editExperienceForm.controls['start_period_month'].value != '' &&
      this.editExperienceForm.controls['start_period_year'].value != '') {
      const start_date = new Date(new Date(this.editExperienceForm.controls['start_period_year'].value).getFullYear(), new Date(this.editExperienceForm.controls['start_period_month'].value).getMonth());
      const end_date = new Date(new Date(this.editExperienceForm.controls['end_period_year'].value).getFullYear(), new Date(this.editExperienceForm.controls['end_period_month'].value).getMonth());
      if (end_date < start_date) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();

    this.isSubmitted = true;
  }

  goBack() {
    this.router.navigateByUrl('app/user/work-experiences');
}
}
