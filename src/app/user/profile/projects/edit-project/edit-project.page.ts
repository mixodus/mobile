import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../../../../app/services/global.service';
import { AuthenticationService } from '../../../../../app/services/auth/authentication.service';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.page.html',
  styleUrls: [
    './styles/edit-project.page.scss'
  ],
})
export class EditProjectPage implements OnInit {

  editProjectForm: FormGroup
  data: any
  workExperience = []
  isSubmitted: boolean = false;

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

        let getWorkExperience = this.router.getCurrentNavigation().extras.state.workId
        let flag = false;
        this.workExperience.push(getWorkExperience[0]);
        for (let i = 0; i < getWorkExperience.length; i++) {
          flag = false;
          for (let j = 0; j < this.workExperience.length; j++) {

            console.log(this.workExperience);
            console.log(getWorkExperience);
            if (getWorkExperience[i].company_name.toLowerCase() === this.workExperience[j].company_name.toLowerCase()) {
              flag = true;
            }

          }
          if (flag === false) {
            this.workExperience.push(getWorkExperience[i]);
          }
        }
      }
    });


  }

  ngOnInit() {
    this.editProjectForm = new FormGroup({
      id: new FormControl('', Validators.compose([
        //
      ])),
      employee_id: new FormControl('', Validators.compose([
        //
      ])),
      work_experience_id: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      project_name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      start_period_month: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      start_period_year: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      position: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      jobdesc: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(20)
      ])),
      end_period_month: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      end_period_year: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      tools: new FormControl('', Validators.compose([
        //
      ])),
    })
    if (this.data == null) {
      return
    }
    this.editProjectForm.controls['id'].setValue(this.data.id)
    this.editProjectForm.controls['employee_id'].setValue(this.data.employee_id)
    this.editProjectForm.controls['work_experience_id'].setValue(this.data.work_experience_id)
    this.editProjectForm.controls['project_name'].setValue(this.data.project_name)
    this.editProjectForm.controls['start_period_month'].setValue(this.data.start_period)
    this.editProjectForm.controls['start_period_year'].setValue(this.data.start_period)
    this.editProjectForm.controls['position'].setValue(this.data.position)
    this.editProjectForm.controls['jobdesc'].setValue(this.data.jobdesc)
    this.editProjectForm.controls['end_period_month'].setValue(this.data.end_period)
    this.editProjectForm.controls['end_period_year'].setValue(this.data.end_period)
    this.editProjectForm.controls['tools'].setValue(this.data.tools)
  }

  async saveProject() {
    let loading = await this.loadingCtrl.create();
    await loading.present();

    if (!this.editProjectForm.valid || this.validDate()) {
      this.presentToast("Mohon isi semua data yang dibutuhkan dengan benar.");
      loading.dismiss();
      return;
    }

    let formData = this.editProjectForm.value;

    let token = this.auth.token;

    let url = this.globalService.getApiUrl() + 'api/project?X-Api-Key=' + this.globalService.getGlobalApiKey() + '&X-Token=' + token;

    if (this.data == null) {
      let currentDate = new Date()
      let addData: any = {
        work_experience_id: formData.work_experience_id,
        project_name: formData.project_name,
        start_period_month: new Date(formData.start_period_month).toLocaleString('default', { month: '2-digit' }),
        start_period_year: new Date(formData.start_period_year).toLocaleString('default', { year: 'numeric' }),
        position: formData.position,
        jobdesc: formData.jobdesc,
        created_at: currentDate.toLocaleString('default', { day: '2-digit' }) + '-' + currentDate.toLocaleString('default', { month: '2-digit' }) + '-' + currentDate.toLocaleString('default', { year: 'numeric' }),
        end_period_month: new Date(formData.end_period_month).toLocaleString('default', { month: '2-digit' }),
        end_period_year: new Date(formData.end_period_year).toLocaleString('default', { year: 'numeric' }),
        tools: formData.tools
      }

      this.http.post(url, addData).pipe(
        finalize(() => this.loadingCtrl.dismiss())
      )
        .subscribe(data => {
          this.presentToast(data["message"]);
          this.globalService.refreshFlag.project = true;
          this.globalService.refreshFlag.profile = true;
          this.globalService.refreshFlag.home = true;
          this.globalService.refreshFlag.level = true;
          this.globalService.refreshFlag.leaderboard = true;
          this.navCtrl.back();
        }, err => {
          let message = "";
          if (err.error.message === undefined)
            message = "Permasalahan jaringan, mohon coba lagi.";
          else
            message = err.error.message;

          this.presentToast(message);
        });
      return
    }

    //convert start month
    formData.start_period_month = this.convertMonth(formData.start_period_month)
    //convert start year
    formData.start_period_year = this.convertYear(formData.start_period_year)
    //convert end month
    formData.end_period_month = this.convertMonth(formData.end_period_month)
    //convert end year
    formData.end_period_year = this.convertYear(formData.end_period_year)

    this.http.put(url, formData).pipe(
      finalize(() => this.loadingCtrl.dismiss())
    )
      .subscribe(data => {
        this.presentToast(data["message"]);
        this.globalService.refreshFlag.project = true;
        this.globalService.refreshFlag.profile = true;
        this.navCtrl.back();
      }, err => {

        let message = "";
        if (err.error.message === undefined)
          message = "Permasalahan jaringan, mohon coba lagi.";
        else
          message = err.error.message;

        this.presentToast(message);
      });
  }

  validDate(): boolean {
    if (this.editProjectForm.controls['end_period_month'].value != '' &&
      this.editProjectForm.controls['end_period_year'].value != '' &&
      this.editProjectForm.controls['start_period_month'].value != '' &&
      this.editProjectForm.controls['start_period_year'].value != '') {
      const start_date = new Date(parseInt(this.convertYear(this.editProjectForm.controls['start_period_year'].value)), parseInt(this.convertMonth(this.editProjectForm.controls['start_period_month'].value)))
      const end_date = new Date(parseInt(this.convertYear(this.editProjectForm.controls['end_period_year'].value)), parseInt(this.convertMonth(this.editProjectForm.controls['end_period_month'].value)))
      if (end_date < start_date) {
        return true
      } else {
        return false
      }
    }
    return false
  }

  convertMonth(month): string {
    if (typeof month === "number") {
      month--;
      month = new Date(0, month).toLocaleString('default', { month: '2-digit' })
    } else {
      month = new Date(month).toLocaleString('default', { month: '2-digit' })
    }
    return month
  }

  convertYear(year): string {
    if (typeof year === "number") {
      year = new Date(year, 1).toLocaleString('default', { year: 'numeric' })
    } else {
      year = new Date(year).toLocaleString('default', { year: 'numeric' })
    }
    return year
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
    this.router.navigateByUrl('app/user/projects');
  }
}
