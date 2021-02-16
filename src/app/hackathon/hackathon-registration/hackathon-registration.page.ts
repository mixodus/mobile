import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Platform, ToastController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { finalize, takeUntil } from 'rxjs/operators';
import { HackathonRegistrationService } from './hackathon-registration.service';
import { FileGroup, HackathonSemesters } from './hackathonRegistrationModel';

@Component({
  selector: 'app-hackathon-registration',
  templateUrl: './hackathon-registration.page.html',
  styleUrls: ['./hackathon-registration.page.scss'],
})
export class HackathonRegistrationPage implements OnInit {
  hackathonForm: FormGroup;
  fileURL: string;
  filepath: string;
  resolvedPath: string;
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
    }
  ];

  isWillingToFollowRules: boolean;
  isWillingToFollowRulesValid = true;

  isHackathonSemesterLoading: boolean;
  isHackathonPostLoading: boolean;
  hackathonSemesters: HackathonSemesters;

  isSubmitted = false;

  constructor(
    private auth: AuthenticationService,
    private hackathonRegistrationService: HackathonRegistrationService,
    private location: Location,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private file: File,
    private filePicker: IOSFilePicker,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private toastCtrl: ToastController,
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
    this.isHackathonSemesterLoading = true;
    this.hackathonRegistrationService.getSemesterData()
      .pipe(finalize(() => this.isHackathonSemesterLoading = false)).subscribe((data: any) => {
      this.hackathonSemesters = this.hackathonRegistrationService.formattingHackathonSemesters(data.data);
    }, (err) => {
      let message = '';
      if (err.error.message === undefined) {
        message = 'Permasalahan jaringan, mohon coba lagi.';
      } else {
        message = err.error.message;
      }

      this.presentToast(message);
      this.isHackathonSemesterLoading = false;
    });

    console.log('hackathonSemester: ', this.hackathonSemesters);
  }

  goBack() {
    this.location.back();
  }

  chooseFile(fileIdx: number) {
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
              this.resolvedPath = path;
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
          })
          .catch();
      }, (err) => {
        this.presentToast(JSON.stringify(err));
      });
    }
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
    console.log('this.fileGroup: ', this.fileGroup);

    if (this.isWillingToFollowRulesValid && this.fileGroup[0].isValid) {
      const formData = this.hackathonForm.value;
      formData.event_id = this.hackathonRegistrationService.eventId;

      this.hackathonRegistrationService.postHackathonData(formData)
        .pipe(finalize(() => this.isHackathonPostLoading = false))
        .subscribe(() => {
          this.hackathonRegistrationService
            .transferFile(this.fileGroup);
        }, (err) => {
          let message = '';
          if (err.error.message === undefined) {
            message = 'Permasalahan jaringan, mohon coba lagi.';
          } else {
            message = err.error.message;
          }

          this.presentToast(message);
          this.isHackathonPostLoading = false;
        });
    }
  }


}
