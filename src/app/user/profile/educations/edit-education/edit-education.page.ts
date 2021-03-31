import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../../../../../app/services/auth/authentication.service';
import { GlobalService } from '../../../../../app/services/global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-education',
  templateUrl: './edit-education.page.html',
  styleUrls: [
    './styles/edit-education.page.scss'
  ],
})
export class EditEducationPage implements OnInit {

  editEducationForm: FormGroup
  data: any;
  isset: boolean = false;
  count: number = 0;
  isSubmitted: boolean = false;
  
  validation_messages = {
    'description': [
      { type: 'required', message: 'Deskripsi dibutuhkan.' },
      { type: 'minlength', message: 'Deskripsi minimal 20 karakter.' },
     
    ],
    'gpa': [
      {type: 'min', message: 'GPA minimal 0.'},
      {type: 'max', message: 'GPA maksimal 4.'},
      {type: 'required', message: 'GPA dibutuhkan.'},
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
        //console.log('this.data: ', this.data);
      }
    });
  }
  // changetoPresent(ev: any){
  //   this.count++;
  //   if(this.count % 2 === 1){
  //     this.isset = true;
  //   }else{
  //     this.isset = false;
  //   }
  // }
  ngOnInit() {
    this.editEducationForm = new FormGroup({
      id: new FormControl('', Validators.compose([
        //
      ])),
      name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      education_level_id: new FormControl('', Validators.compose([
        Validators.required
      ])),
      field_of_study: new FormControl('', Validators.compose([
        Validators.required
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
      checkbox: new FormControl('', Validators.compose([
      ])),
      gpa: new FormControl('', Validators.compose([
        Validators.required,
        Validators.min(0),
        Validators.max(4)
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(20)
      ])),
    })
    if (this.data == null) {
      return
    }
    this.editEducationForm.controls['id'].setValue(this.data.qualification_id);
    this.editEducationForm.controls['name'].setValue(this.data.name);
    this.editEducationForm.controls['education_level_id'].setValue(this.data.education_level_id);
    this.editEducationForm.controls['field_of_study'].setValue(this.data.field_of_study);
    this.editEducationForm.controls['start_period_month'].setValue(this.data.start_period);
    this.editEducationForm.controls['start_period_year'].setValue(this.data.start_period);
    if (new Date(this.data.end_period).getFullYear() === 9999) {
      this.isset = true;
    } else {
      this.editEducationForm.controls['end_period_month'].setValue(this.data.end_period);
      this.editEducationForm.controls['end_period_year'].setValue(this.data.end_period);
    }
    this.editEducationForm.controls['gpa'].setValue(this.data.gpa);
    this.editEducationForm.controls['description'].setValue(this.data.description);
    this.onChangeCheckbox();
  }
  onChangeCheckbox(){
    if(this.isset){
      this.editEducationForm.controls['end_period_month'].disable();
      this.editEducationForm.controls['end_period_year'].disable();
    } else {
      this.editEducationForm.controls['end_period_month'].enable();
      this.editEducationForm.controls['end_period_year'].enable();
    }
  }
  async saveEducation() {
    let loading = await this.loadingCtrl.create();
    await loading.present();

    if(!this.editEducationForm.valid || this.validDate()){
      this.presentToast("Mohon isi semua data yang dibutuhkan dengan benar.");
      loading.dismiss();
      return;
    }

    const formData = this.editEducationForm.value;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });
    const options = { headers: headers };

    const educationEndpoint =
      this.globalService.apiUrl +
      'api/education';

    if (this.data == null) {
      let addData: any = {};
      addData = {
        name: formData.name,
        start_period_month: new Date(formData.start_period_month).toLocaleString('default', { month: '2-digit' }),
        start_period_year: new Date(formData.start_period_year).toLocaleString('default', { year: 'numeric' }),
        education_level_id: formData.education_level_id,
        description: formData.description,
        gpa: formData.gpa,
        field_of_study: formData.field_of_study
      }
      if (this.isset === true) {
        addData.end_period_month = '12'
        addData.end_period_year = '9999'
      } else {
        addData.end_period_month = new Date(formData.end_period_month).toLocaleString('default', { month: '2-digit' })
        addData.end_period_year = new Date(formData.end_period_year).toLocaleString('default', { year: 'numeric' })
      }

      this.http.post(educationEndpoint, addData, options).pipe(
        finalize(() => this.loadingCtrl.dismiss())
      )
        .subscribe(data => {
          this.presentToast(data["message"]);
          this.globalService.refreshFlag.education = true;
          this.globalService.refreshFlag.profile = true;
          this.globalService.refreshFlag.home = true;
          this.globalService.refreshFlag.level = true;
          this.globalService.refreshFlag.leaderboard = true;
          this.navCtrl.back();
        }, err => {
          //console.log('JS Call error: ', err);

          let message = "";
          if (err.error.message === undefined)
            message = "Permasalahan jaringan, mohon coba lagi.";
          else
            message = err.error.message;

          this.presentToast(message);
        });
      return;
    }
    //convert start month
    formData.start_period_month = new Date(formData.start_period_month).toLocaleString('default', { month: '2-digit' })
    //convert start year
    formData.start_period_year = new Date(formData.start_period_year).toLocaleString('default', { year: 'numeric' })
    //convert end month
    if (this.isset) {
      formData.end_period_month = '12';
    } else {
      formData.end_period_month = new Date(formData.end_period_month).toLocaleString('default', { month: '2-digit' })
    }
    //convert end year
    if (this.isset) {
      formData.end_period_year = '9999';
    } else {
      formData.end_period_year = new Date(formData.end_period_year).toLocaleString('default', { year: 'numeric' })
    }

    this.http.put(educationEndpoint, formData, options).pipe(
      finalize(() => this.loadingCtrl.dismiss())
    )
      .subscribe(data => {
        this.presentToast(data["message"]);
        this.globalService.refreshFlag.education = true;
        this.globalService.refreshFlag.profile = true;
        this.navCtrl.back();
      }, err => {
        //console.log('JS Call error: ', err);

        let message = "";
        if (err.error.message === undefined)
          message = "Permasalahan jaringan, mohon coba lagi.";
        else
          message = err.error.message;

        this.presentToast(message);
      });
  }

  validDate() : boolean {
    if (!this.isset && this.editEducationForm.controls['end_period_month'].value != '' &&
      this.editEducationForm.controls['end_period_year'].value != '' &&
      this.editEducationForm.controls['start_period_month'].value != '' &&
      this.editEducationForm.controls['start_period_year'].value != '') {
      const start_date = new Date(new Date(this.editEducationForm.controls['start_period_year'].value).getFullYear(), new Date(this.editEducationForm.controls['start_period_month'].value).getMonth())
      const end_date = new Date(new Date(this.editEducationForm.controls['end_period_year'].value).getFullYear(), new Date(this.editEducationForm.controls['end_period_month'].value).getMonth())
      if(end_date < start_date){
        return true
      } else {
        return false
      }
    }
    return false
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();

    this.isSubmitted = true;
  }
  goBack(){
    this.router.navigateByUrl('app/user/educations')
  }
}
