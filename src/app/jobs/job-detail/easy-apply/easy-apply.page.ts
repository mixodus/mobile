import { Component, OnInit } from '@angular/core';
import { UserProfileModel } from '../../../user/profile/user-profile.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalService } from '../../../services/global.service';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { HttpClient } from '@angular/common/http';
import { LoadingController, NavController, ToastController, AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Chooser, ChooserResult } from '@ionic-native/chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
  selector: 'app-easy-apply',
  templateUrl: './easy-apply.page.html',
  styleUrls: ['./styles/easy-apply.page.scss', './styles/easy-apply.shell.scss'],
})
export class EasyApplyPage implements OnInit {
  profile: UserProfileModel;
  chosenCV: ChooserResult;
  job: any;
  easyApplyForm: FormGroup;

  profileImg = './assets/sample-images/user/default-profile.svg';
  companyImg = 'assets/images/company.svg';

  validation_messages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' },
    ],
    contact_no: [
      { type: 'required', message: 'Phone Number is required.' },
      { type: 'pattern', message: 'Phone Number must be numeric' },
      { type: 'minlength', message: 'Phone Number must be at least 8 characters long.' },
      { type: 'maxlength', message: 'Phone Number must be less than 13 characters.' },
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private globalService: GlobalService,
    private auth: AuthenticationService,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private toast: ToastController,
    private alertCtrl: AlertController,
    private chooser: Chooser,
    private filePath: FilePath,
    private fileOpener: FileOpener
  ) {
  }

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.job = this.router.getCurrentNavigation().extras.state.data;
        this.profile = this.router.getCurrentNavigation().extras.state.profile;
        this.initForm();
      } else {
        this.presentToast('Pick a job first');
        this.router.navigateByUrl('app/jobs');
      }
    });
  }

  initForm() {
    this.easyApplyForm = new FormGroup({
      email: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
      contact_no: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(8),
          Validators.maxLength(13),
        ])
      ),
    });
    this.easyApplyForm.controls['email'].setValue(this.profile.email);
    this.easyApplyForm.controls['contact_no'].setValue(this.profile.contact_no);
  }

  ionViewWillEnter() {
    this.auth.checkExpiredToken();
    // this.testAlert();
  }

  async testAlert() {
    const alert = await this.alertCtrl.create({
      message: `<div class="message-body">
                    <p class="title">Terima Kasih</p>
                    <p class="content">Lamaran Anda sudah berhasil dikirimkan dan akan kami review secepatnya.</p>
                </div>`,
      cssClass: 'idstar-custom-alert',
      buttons: [
        {
          cssClass: 'idstar-custom-alert-action',
          text: 'Kembali Ke Pekerjaan',
          handler: () => {
            this.navCtrl.navigateForward(['/app/jobs']);
          },
        },
      ],
    });

    await alert.present();
  }

  async confirm() {
    if (this.easyApplyForm.invalid) {
      for (let index = 0; index < this.validation_messages.email.length; index++) {
        if (this.easyApplyForm.get('email').hasError(this.validation_messages.email[index].type)) {
          this.presentToast(this.validation_messages.email[index].message);
          return;
        }
      }
      for (let index = 0; index < this.validation_messages.contact_no.length; index++) {
        if (
          this.easyApplyForm
            .get('contact_no')
            .hasError(this.validation_messages.contact_no[index].type)
        ) {
          this.presentToast(this.validation_messages.contact_no[index].message);
          return;
        }
      }
    }


    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi',
      message: 'Apakah kamu yakin ingin melamar?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
        },
        {
          text: 'Ya',
          handler: (blah) => {
            this.apply();
          },
        },
      ],
    });
    await alert.present();
  }

  async apply() {
    // show loading
    const loading = await this.loadingCtrl.create();
    await loading.present();

    // job apply data
    const easyApply = this.easyApplyForm.value;

    const dataPass = {
      job_id: this.job.job_id,
      email: easyApply.email,
      contact_no: easyApply.contact_no,
    };

    console.log(dataPass);

    const token = this.auth.token;
    const url =
      this.globalService.getApiUrl() +
      'api/job_post/apply?X-Api-Key=' +
      this.globalService.getGlobalApiKey() +
      '&X-Token=' +
      token;

    this.http
      .post(url, dataPass)
      .pipe(finalize(() => this.loadingCtrl.dismiss()))
      .subscribe(
        async (data) => {
          this.globalService.refreshFlag.job_detail = true;
          this.globalService.refreshFlag.jobApp = true;
          this.globalService.refreshFlag.home = true;

          const alert = await this.alertCtrl.create({
            message: `<div class="message-body">
                    <p class="title">Terima Kasih</p>
                    <p class="content">Lamaran Anda sudah berhasil dikirimkan dan akan kami review secepatnya.</p>
                </div>`,
            cssClass: 'idstar-custom-alert',
            buttons: [
              {
                cssClass: 'idstar-custom-alert-action',
                text: 'Kembali Ke Pekerjaan',
                handler: () => {
                  this.navCtrl.navigateForward(['/app/jobs']);
                },
              },
            ],
          });

          await alert.present();
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

  pickChooser() {
    this.chooser
      .getFile(
        'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
      .then((file) => {
        this.chosenCV = file;
      })
      .catch((err) => alert('Error: ' + err));
  }

  openDocument() {
    this.filePath
      .resolveNativePath(this.chosenCV.uri)
      .then((path) => {
        this.fileOpener.open(path, this.chosenCV.mediaType).catch((err) => alert(err));
      })
      .catch((err) => alert(err));
  }

  removeResume() {
    this.chosenCV = null;
  }

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.back();
  }
}
