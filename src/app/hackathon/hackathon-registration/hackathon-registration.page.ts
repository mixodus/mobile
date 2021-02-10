import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Platform, ToastController } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

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
  fileTransfer: FileTransferObject;
  filetype: string;
  isFileValid = true;
  pathInterface: string;
  isWillingToFollowRules: boolean;

  constructor(
    private auth: AuthenticationService,
    private location: Location,
    private formBuilder: FormBuilder,
    private platform: Platform,
    private file: File,
    private filePicker: IOSFilePicker,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private toastCtrl: ToastController,
  ) {
  }

  ngOnInit() {
    this.hackathonForm = new FormGroup({
      universityName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      semester: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  goBack() {
    this.location.back();
  }

  chooseFile() {
    if (this.platform.is('android')) {
      this.fileChooser.open().then(uri => {
        this.fileURL = uri;
        this.filePath.resolveNativePath(this.fileURL)
          .then(path => {
            this.file.resolveLocalFilesystemUrl(this.fileURL).then(fileEntry => {
              fileEntry.getMetadata((metadata) => {
                if (metadata.size > 5242880) {
                  this.presentToast('Mohon menggunakan file size yang lebih kecil.');
                  this.pathInterface = '';
                } else {
                  const index = path.lastIndexOf('/');
                  this.filepath = path.substr(index + 1);
                  this.filetype = this.filepath.substr(this.filepath.lastIndexOf('.') + 1);
                  if (this.filetype === 'jpg' || this.filetype === 'png') {
                    this.resolvedPath = path;
                    this.pathInterface = this.filepath;
                  } else {
                    this.presentToast('Mohon menggunakan file jpg/png.');
                    this.pathInterface = '';
                  }
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

  getfileName() {
    if (this.pathInterface) {
      return this.pathInterface;
    }
  }

  handleRegistrationClick() {

  }
}
