import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalService } from '../../services/global.service';
import { AuthenticationService } from '../../services/auth/authentication.service';
import { NewsResponse } from '../../core/models/news/NewsResponse';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { FileGroup } from './hackathonRegistrationModel';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HackathonRegistrationService {
  eventId: number;
  fileTransfer: FileTransferObject;

  constructor(
    private http: HttpClient,
    private globalService: GlobalService,
    private auth: AuthenticationService,
    private transfer: FileTransfer,
    private toast: ToastController
  ) {
  }

  setEventId(eventId: number) {
    this.eventId = eventId;
  }

  getSemesterData() {
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

  formattingHackathonSemesters(unformattedHackathonSemesters: any) {
    return {
      semesters: unformattedHackathonSemesters.format1
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
    this.transferFileA(fileGroup[0], 1);
    this.transferFileB(fileGroup[1]);
    this.transferFileC(fileGroup[2]);
  }

  transferFileA(file: FileGroup, typeNumber) {
    console.log('masuk transferFileA');
    this.fileTransfer = this.transfer.create();

    console.log('file.type + 1: ', file.type + 1);

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
      this.presentToast('File berhasil diperbaharui.');
    }, (err) => {
      console.log('err: ', err);
      this.presentToast(err.message);
    });
  }

  transferFileB(file: FileGroup) {}
  transferFileC(file: FileGroup) {}

  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000,
    });
    toast.present();
  }
}
