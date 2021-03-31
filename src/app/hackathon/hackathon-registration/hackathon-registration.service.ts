import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { NewsResponse } from '../../core/models/news/NewsResponse';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { FileGroup } from './hackathonRegistrationModel';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HackathonRegistrationService {
  eventId: number;
  fileTransfer: FileTransferObject;
  fileGroup: FileGroup[];
  isLoading = false;
  loadingMessage = 'Memuat';

  constructor(
    private http: HttpClient,
    private globalService: GlobalService,
    private auth: AuthenticationService,
    private transfer: FileTransfer,
    private alertCtrl: AlertController,
    private toast: ToastController,
    private router: Router
  ) {
  }

  setEventId(eventId: number) {
    this.eventId = eventId;
  }

  getHackationRegistrationDetailData() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
    });
    const options = { headers: headers };

    const hackathonSemesterEndpoint =
      this.globalService.apiUrl +
      'api/event/hackathon/semester';

    return this.http.get<NewsResponse>(hackathonSemesterEndpoint, options);
  }

  formattingHackathonRegistrationDetail(unformattedHackathonRegistrationDetail: any) {
    return {
      semesters: unformattedHackathonRegistrationDetail.format1,
      imageUrl: unformattedHackathonRegistrationDetail.upload_icon_url
    };
  }

  postHackathonData(formData: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Api-Key': this.globalService.getGlobalApiKey(),
      'X-Token': `${this.auth.token}`
    });
    const options = { headers: headers };

    const hackathonEndpoint =
      this.globalService.apiUrl +
      'api/event/hackathon';

    return this.http.post<any>(hackathonEndpoint, formData, options);
  }

  transferFile(fileGroup: FileGroup[]) {
    this.fileGroup = fileGroup;
    this.transferFileA(1);
  }

  transferFileA(typeNumber) {
    this.setLoadingOn();
    this.setLoadingMessage('Upload ID Card...');

    const file = this.fileGroup[0];
    // console.log('file 0: ', file);
    this.fileTransfer = this.transfer.create();

    const options: FileUploadOptions = {
      fileName: file.pathInterface,
      chunkedMode: false,
      headers: {
        'X-Api-Key': this.globalService.getGlobalApiKey(),
        'X-Token': `${this.auth.token}`
      },
      params: {
        event_id: this.eventId,
        type: typeNumber
      }
    };

    const uploadFileEndpoint = encodeURI(this.globalService.getApiUrl() + 'api/event/hackathon/file');

    this.fileTransfer.upload(file.fileUrl, uploadFileEndpoint, options).then((data) => {
      const message = JSON.parse(data.response).message;
      this.presentToast(message);
      this.setLoadingOff();
      this.setLoadingMessage('');
      this.transferFileB(2);
    }, (err) => {
      const errMessage = JSON.parse(err.body).message;
      this.presentAlert(errMessage);
      this.setLoadingOff();
      this.setLoadingMessage('');
    });
  }

  transferFileB(typeNumber) {
    this.setLoadingOn();
    this.setLoadingMessage('Uploading Student card...');
    // console.log('masuk transferFileB');
    const file = this.fileGroup[1];
    // console.log('file 1: ', file);
    this.fileTransfer = this.transfer.create();

    const options: FileUploadOptions = {
      fileName: file.pathInterface,
      chunkedMode: false,
      headers: {
        'X-Api-Key': this.globalService.getGlobalApiKey(),
        'X-Token': `${this.auth.token}`
      },
      params: {
        event_id: this.eventId,
        type: typeNumber
      }
    };
    const uploadFileEndpoint = encodeURI(this.globalService.getApiUrl() + 'api/event/hackathon/file');

    this.fileTransfer.upload(file.fileUrl, uploadFileEndpoint, options).then((data) => {
      const message = JSON.parse(data.response).message;
      this.presentToast(message);
      // console.log('B sukses');
      this.setLoadingOff();
      this.setLoadingMessage('');
      this.transferFileC(3);
    }, (err) => {
      const errMessage = JSON.parse(err.body).message;
      this.presentAlert(errMessage);
      this.setLoadingOff();
      this.setLoadingMessage('');
    });
  }

  transferFileC(typeNumber) {

    this.setLoadingOn();
    this.setLoadingMessage('Uploading Academic Transcript...');
    // console.log('masuk transferFileC');
    const file = this.fileGroup[2];
    // console.log('file 2: ', file);
    this.fileTransfer = this.transfer.create();

    const options: FileUploadOptions = {
      fileName: file.pathInterface,
      chunkedMode: false,
      headers: {
        'X-Api-Key': this.globalService.getGlobalApiKey(),
        'X-Token': `${this.auth.token}`
      },
      params: {
        event_id: this.eventId,
        type: typeNumber
      }
    };
    const uploadFileEndpoint = encodeURI(this.globalService.getApiUrl() + 'api/event/hackathon/file');

    this.fileTransfer.upload(file.fileUrl, uploadFileEndpoint, options).then((data) => {
      const message = JSON.parse(data.response).message;
      this.presentToast(message);
      // console.log('C sukses');
      this.setLoadingOff();
      this.setLoadingMessage('');      
      this.transferFileD(4);
      
    }, (err) => {
      const errMessage = JSON.parse(err.body).message;
      this.presentAlert(errMessage);
      this.setLoadingOff();
      this.setLoadingMessage('');
    });
  }

  
  transferFileD(typeNumber) {
    const file = this.fileGroup[3];
    // console.log('file 3: ', file);
    this.setLoadingOn();
    this.setLoadingMessage('Uploading CV...');
    // console.log('masuk transferFileD');
    this.fileTransfer = this.transfer.create();

    const options: FileUploadOptions = {
      fileName: file.pathInterface,
      chunkedMode: false,
      headers: {
        'X-Api-Key': this.globalService.getGlobalApiKey(),
        'X-Token': `${this.auth.token}`
      },
      params: {
        event_id: this.eventId,
        type: typeNumber
      }
    };
    const uploadFileEndpoint = encodeURI(this.globalService.getApiUrl() + 'api/event/hackathon/file');

    this.fileTransfer.upload(file.fileUrl, uploadFileEndpoint, options).then((data) => {
      const message = JSON.parse(data.response).message;
      this.presentToast(message);
      // console.log('D sukses');
      this.setLoadingOff();
      this.setLoadingMessage('');
      this.router.navigateByUrl('app/hackathon');
    }, (err) => {
      const errMessage = JSON.parse(err.body).message;
      this.presentAlert(errMessage);
      this.setLoadingOff();
      this.setLoadingMessage('');
      
    });
  }
  

  async presentAlert(message) {
    const alert = await this.alertCtrl.create({
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }


  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }
  
  setLoadingOn() {
    this.isLoading = true;
  }

  setLoadingOff() {
    this.isLoading = false;
  }

  setLoadingMessage(message: string) {
    this.loadingMessage = message;
  }
}
