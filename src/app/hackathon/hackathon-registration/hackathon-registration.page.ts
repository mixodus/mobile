import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { finalize } from 'rxjs/operators';
import { HackathonRegistrationService } from './hackathon-registration.service';
import { FileGroup, HackathonRegistrationDetail } from './hackathonRegistrationModel';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop, CropOptions } from '@ionic-native/crop/ngx';

@Component({
  selector: 'app-hackathon-registration',
  templateUrl: './hackathon-registration.page.html',
  styleUrls: ['./hackathon-registration.page.scss'],
})
export class HackathonRegistrationPage implements OnInit {
  hackathonForm: FormGroup;
  fileURL: string;
  filepath: string;
  filetype: string;

  fileGroup: FileGroup[] = [
    {
      pathInterface: '',
      isValid: false,
      type: '',
      fileUrl: ''
    },
    {
      pathInterface: '',
      isValid: false,
      type: '',
      fileUrl: ''
    },
    {
      pathInterface: '',
      isValid: false,
      type: '',
      fileUrl: ''
    },
    {
      pathInterface: '',
      isValid: false,
      type: '',
      fileUrl: ''
    }
  ];

  isWillingToFollowRules: boolean;
  isWillingToFollowRulesValid = true;
  

  isHackathonSemesterLoading: boolean;
  isHackathonPostLoading: boolean;
  hackathonRegistrationDetail: HackathonRegistrationDetail;

  isSubmitted = false;

  constructor(
    private auth: AuthenticationService,
    private hackathonRegistrationService: HackathonRegistrationService,
    private location: Location,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private file: File,
    private camera: Camera,
    private filePicker: IOSFilePicker,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private toastCtrl: ToastController,
    private modalController: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private crop: Crop,
  ) {
    this.hackathonForm = new FormGroup({
      university: new FormControl('', Validators.compose([
        Validators.required
      ])),
      major: new FormControl('', Validators.compose([
        Validators.required
      ])),
      semester: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  ngOnInit() {
    this.getHackathonSemester();
  }

  doRefresh(ev) {
    this.getHackathonSemester();

    ev.target.complete();
  }

  ionViewWillEnter() {
    if (this.auth.token) {
      this.auth.checkExpiredToken();
    } else if (!this.auth.token) {
      this.auth.signOut();
    }
  }

  getHackathonSemester() {
    this.hackathonRegistrationService.setLoadingOn();
    this.hackathonRegistrationService.setLoadingMessage('Memuat...');
    this.hackathonRegistrationService.getHackationRegistrationDetailData()
      .pipe(finalize(
        () => {
          this.hackathonRegistrationService.setLoadingOff();
          this.hackathonRegistrationService.setLoadingMessage('');
        }
      )).subscribe((data: any) => {
      this.hackathonRegistrationDetail = this.hackathonRegistrationService.formattingHackathonRegistrationDetail(data.data);
    }, (err) => {
      let message = '';
      if (err.error.message === undefined) {
        message = 'Permasalahan jaringan, mohon coba lagi.';
      } else {
        message = err.error.message;
      }

      this.presentToast(message);
      this.hackathonRegistrationService.setLoadingOff();
      this.hackathonRegistrationService.setLoadingMessage('');
    });

    console.log('hackathonSemester: ', this.hackathonRegistrationDetail);
  }

  goBack() {
    this.location.back();
  }

  async chooseFileMethod(fileIdx: number) {
    const alert = await this.alertCtrl.create({
      header: 'Unggah Foto',
      buttons: [
        {
          text: 'Ambil Foto',
          handler: () => {
            this.obtainPicture(this.camera.PictureSourceType.CAMERA, fileIdx);
          }
        },
        {
          text: 'Pilih Foto',
          handler: () => {
            this.obtainPicture(this.camera.PictureSourceType.PHOTOLIBRARY, fileIdx);
            // this.chooseFile(fileIdx);
          }
        }
      ]
    });

    await alert.present();
  }

  obtainPicture(source, fileIdx) {

    const camOpt: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: source,
      targetHeight: 500,
      targetWidth: 500,
    };

    this.camera.getPicture(camOpt).then((imageData) => {
      console.log('imageData: ', imageData);

      this.showCroppedImage(imageData.split('?')[0], fileIdx);

    }, (err) => {
      this.presentToast(err);
    });

  }

  async showCroppedImage(ImagePath, fileIdx) {
    const loading = await this.loadingCtrl.create({});
    await loading.present();

    const splittedPath = ImagePath.split('/');
    const imageName = splittedPath[splittedPath.length - 1];
    const filePath = ImagePath.split(imageName)[0];

    console.log('splittedPath: ', splittedPath);
    console.log('imageName: ', imageName);
    console.log('filePath: ', filePath);

    this.file.readAsDataURL(filePath, imageName).then((base64) => {
      console.log('base64: ', base64);
      this.fileGroup[fileIdx].pathInterface = imageName;
      this.fileGroup[fileIdx].isValid = true;
      this.fileGroup[fileIdx].type = 'png';
      this.fileGroup[fileIdx].fileUrl = base64;

      loading.dismiss();
    }, (error) => {
      this.presentToast(error);

      this.fileGroup[fileIdx].pathInterface = '';
      this.fileGroup[fileIdx].isValid = false;
      this.fileGroup[fileIdx].type = '';
      this.fileGroup[fileIdx].fileUrl = '';

      loading.dismiss();
    });
  }

  chooseFile(fileIdx: number) {
    if (this.platform.is('ios')) {
      this.filePicker.pickFile().then(uri => {
        console.log('uri ios: ', uri);
        let fileName = '';

        if (fileIdx === 0) {
          fileName = 'file_ktp';
        } else if (fileIdx === 1) {
          fileName = 'file_kartu_mahasiswa';
        } else if (fileIdx === 2){
          fileName = 'file_transkrip_nilai';
        } else if (fileIdx === 3){
          fileName = 'file_CV';
        }
        this.fileURL = uri;
        this.fileGroup[fileIdx].fileUrl = uri;
        this.fileGroup[fileIdx].pathInterface = fileName;
        this.fileGroup[fileIdx].isValid = true;
        this.fileGroup[fileIdx].type = this.filetype;
      }, (err) => {
        this.presentToast(JSON.stringify(err));
      });
    }

    if (this.platform.is('android')) {
      this.fileChooser.open().then(uri => {
        this.fileURL = uri;
        this.fileGroup[fileIdx].fileUrl = uri;
        this.filePath.resolveNativePath(this.fileURL)
          .then(path => {
            const index = path.lastIndexOf('/');
            this.filepath = path.substr(index + 1);
            this.filetype = this.filepath.substr(this.filepath.lastIndexOf('.') + 1);
            if (this.filetype === 'jpg' || this.filetype === 'png') {
              this.fileGroup[fileIdx].pathInterface = this.filepath;
              this.fileGroup[fileIdx].isValid = true;
              this.fileGroup[fileIdx].type = this.filetype;
            } else {
              this.presentToast('Mohon menggunakan file jpg/png.');
              this.fileGroup[fileIdx].pathInterface = '';
              this.fileGroup[fileIdx].isValid = false;
              this.fileGroup[fileIdx].type = '';
              this.fileGroup[fileIdx].fileUrl = '';
            }

            this.file.resolveLocalFilesystemUrl(this.fileURL).then(fileEntry => {
              fileEntry.getMetadata((metadata) => {
                if (metadata.size > 5242880) {
                  this.presentToast('Mohon menggunakan file size yang lebih kecil.');
                  this.fileGroup[fileIdx].pathInterface = '';
                  this.fileGroup[fileIdx].isValid = false;
                  this.fileGroup[fileIdx].type = '';
                  this.fileGroup[fileIdx].fileUrl = '';
                }
              });
            });
          });
      }, (err) => {
        this.presentToast(JSON.stringify(err));
      });
    }

    // if (this.platform.is('android')) {
    //   this.fileChooser.open().then(uri => {
    //     let fileName = '';
    //
    //     if (fileIdx === 0) {
    //       fileName = 'file_ktp';
    //     } else if (fileIdx === 1) {
    //       fileName = 'file_kartu_mahasiswa';
    //     } else {
    //       fileName = 'file_transkrip_nilai';
    //     }
    //
    //     this.fileURL = uri;
    //     this.fileGroup[fileIdx].fileUrl = uri;
    //     this.fileGroup[fileIdx].pathInterface = fileName;
    //     this.fileGroup[fileIdx].isValid = true;
    //     this.fileGroup[fileIdx].type = this.filetype;
    //   }, (err) => {
    //     this.presentToast(JSON.stringify(err));
    //   });
    // }
  }

  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }

  getfileName(idx: number) {
    if (this.fileGroup[idx].pathInterface) {
      return this.fileGroup[idx].pathInterface;
    }
  }

 
  
    
  


  handleRegistrationClick() {
    this.isSubmitted = true;
    this.isWillingToFollowRulesValid = this.isWillingToFollowRules;

    if (this.isWillingToFollowRulesValid && this.fileGroup[0].isValid && this.fileGroup[1].isValid && this.fileGroup[2].isValid && this.fileGroup[3].isValid  ) {

      this.hackathonRegistrationService.setLoadingOn();
      this.hackathonRegistrationService.setLoadingMessage('Submit Data...');
      const formData = this.hackathonForm.value;
      formData.event_id = this.hackathonRegistrationService.eventId;

      this.hackathonRegistrationService.postHackathonData(formData)
        .pipe(finalize(() => {
          this.hackathonRegistrationService.setLoadingOff();
          this.hackathonRegistrationService.setLoadingMessage('');
        }))
        .subscribe(() => {
          this.hackathonRegistrationService.transferFile(this.fileGroup);
        }, (err) => {
          let message = '';
          if (err.error.message === undefined) {
            message = 'Permasalahan jaringan, mohon coba lagi.';
          } else {
            message = err.error.message;
          }

          this.presentToast(message);
          this.hackathonRegistrationService.setLoadingOff();
          this.hackathonRegistrationService.setLoadingMessage('');
        });
    }
  }

  async showRules() {
    const modal = await this.modalController.create({
      component: TermsConditionsComponent,
      componentProps: {
        title: 'Peraturan Hackathon',
      },
    });

    await modal.present();
  }
}
