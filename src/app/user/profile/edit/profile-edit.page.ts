import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../../../../app/services/auth/authentication.service';
import { GlobalService } from '../../../../app/services/global.service';
import { HttpClient } from '@angular/common/http';
import { LoadingController, ToastController, NavController, AlertController, Platform } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop, CropOptions } from '@ionic-native/crop/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx'
import { url } from 'inspector';

@Component({
  selector: 'app-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: [
    './styles/profile-edit.page.scss',
    './styles/profile-edit.shell.scss',
    './styles/profile-edit.ios.scss',
    './styles/profile-edit.md.scss',
  ],
})
export class EditPage implements OnInit {
  editProfileForm: FormGroup;
  profile: any;
  profileImg: string = "../assets/sample-images/user/default-profile.svg";
  provices: Array<string>
  countries: Array<{ code: string, name: string }>
  profilePictureChanged: boolean = false;
  base64s: any;
  fileURL: string;
  fileTransfer: FileTransferObject;

  @HostBinding('class.is-shell') get isShell() {
    return !!(this.profile && this.profile.isShell);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private globalService: GlobalService,
    private storage: Storage,
    private auth: AuthenticationService,
    private loadingCtrl: LoadingController,
    private toast: ToastController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,

    private camera: Camera,
    private crop: Crop,
    private webView: WebView,
    private file: File,

    private platform: Platform,
    public fileChooser: FileChooser,
    public filePath: FilePath,
    // public base64: Base64,
    private transfer: FileTransfer,
    private filePicker: IOSFilePicker
  ) {
  }

  ngOnInit(): void {
    this.provices = this.globalService.provinceArr;
    this.countries = this.globalService.countriesArr;
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.profile = this.router.getCurrentNavigation().extras.state.data;
        this.getDataToForm();
      } else {
        this.router.navigateByUrl('app/user')
      }
    });
  }

  getDataToForm() {
    this.editProfileForm = new FormGroup({
      profile_picture: new FormControl(''),
      profile_picture_url: new FormControl(''),
      fullname: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      job_title: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      date_of_birth: new FormControl('', Validators.compose([
        // Validators.required,
      ])),
      gender: new FormControl('', Validators.compose([
        // Validators.required,
      ])),
      contact_no: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern("^[0-9]*$"),
      ])),
      marital_status: new FormControl('', Validators.compose([
        // Validators.required,
      ])),
      country: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      province: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      address: new FormControl('', Validators.compose([
        // Validators.required,
      ])),
      zip_code: new FormControl('', Validators.compose([
        // Validators.required,
      ])),
      summary: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    })
    this.editProfileForm.controls['profile_picture'].setValue(this.profile.profile_picture)
    this.editProfileForm.controls['profile_picture_url'].setValue(this.profile.profile_picture_url)
    this.editProfileForm.controls['fullname'].setValue(this.profile.fullname)
    this.editProfileForm.controls['job_title'].setValue(this.profile.job_title)
    this.editProfileForm.controls['summary'].setValue(this.profile.summary)
    if (this.profile.date_of_birth === '' || this.profile.date_of_birth === null) {
      this.editProfileForm.controls['date_of_birth'].setValue(new Date().toISOString().slice(0, 10))
    } else {
      this.editProfileForm.controls['date_of_birth'].setValue(this.profile.date_of_birth)
    }
    if (this.profile.gender === '' || this.profile.gender === null) {
      this.editProfileForm.controls['gender'].setValue("Male")
    } else {
      this.editProfileForm.controls['gender'].setValue(this.profile.gender)
    }
    if (this.profile.date_of_birth === '' || this.profile.date_of_birth === null) {
      this.editProfileForm.controls['marital_status'].setValue("Sing")
    } else {
      this.editProfileForm.controls['marital_status'].setValue(this.profile.marital_status)
    }
    this.editProfileForm.controls['country'].setValue(this.profile.country)
    this.editProfileForm.controls['province'].setValue(this.profile.province)
    this.editProfileForm.controls['address'].setValue(this.profile.address)
    this.editProfileForm.controls['zip_code'].setValue(this.profile.zip_code)
    this.editProfileForm.controls['contact_no'].setValue(this.profile.contact_no)

    console.log(this.editProfileForm.value);
  }

  async openCam() {

    const alert = await this.alertCtrl.create({
      header: 'Ganti Foto',
      buttons: [
        {
          text: 'Ambil foto',
          handler: (blah) => {
            this.obtainPicture(this.camera.PictureSourceType.CAMERA)
          }
        },
        {
          text: 'Pilih dari Galeri',
          handler: () => {
            this.obtainPicture(this.camera.PictureSourceType.PHOTOLIBRARY)
          }
        }
      ]
    })

    await alert.present();
  }

  obtainPicture(source) {

    const camOpt: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      // allowEdit: true,
      correctOrientation: true,
      sourceType: source,
      targetHeight: 700,
      targetWidth: 700,
    }

    const cropOpt: CropOptions = {
      quality: 70
    }

    this.camera.getPicture(camOpt).then((imageData) => {
      this.crop.crop(imageData, cropOpt).then((cropped) => {
        this.showCroppedImage(cropped.split('?')[0])
      }, (err) => {
        // Handle error
        console.log("Error " + err);
      })
    }, (err) => {
      // Handle error
      console.log("Error " + err);
    });

  }

  async showCroppedImage(ImagePath) {
    const loading = await this.loadingCtrl.create({

    });
    await loading.present();
    var copyPath = ImagePath;
    var splitPath = copyPath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    var filePath = ImagePath.split(imageName)[0];

    this.file.readAsDataURL(filePath, imageName).then(base64 => {
      this.editProfileForm.controls['profile_picture'].setValue(base64);
      this.editProfileForm.controls['profile_picture_url'].setValue(base64);
      this.profilePictureChanged = true;
      loading.dismiss()
    }, error => {
      alert('Error in showing image' + error);
      loading.dismiss()
    });
  }

  async presentLoading() {
  }
  // async PickFileAndGetBase64String(){
  //   let loading = await this.loadingCtrl.create();
  //   this.fileChooser.open().then((fileuri)=>{
  //     loading.present();
  //     this.filePath.resolveNativePath(fileuri)
  //     .then((nativepath)=>{
  //       this.base64.encodeFile(nativepath)
  //       .then((base64string)=>{
  //         this.base64s = base64string;
  //         loading.dismiss();
  //         console.log(base64string);
  //       })
  //     })
  //   })
  // }


  // choose() {
  //   this.fileChooser.open().then((uri) => {
  //     alert(uri);
  //     this.file.resolveLocalFilesystemUrl(uri).then((newUrl) => {
  //       alert(JSON.stringify(newUrl));

  //       let dirPath = newUrl.nativeURL;
  //       let dirPathSegment = dirPath.split('/')
  //       dirPathSegment.pop()
  //       dirPath = dirPathSegment.join('/')

  //       this.file.readAsArrayBuffer(dirPath, newUrl.name).then(async (buffer) => {
  // await this.upload(buffer, newUrl.name);
  //       })
  //     })

  //   })
  // }

  // async upload(buffer, name) {
  //   let blob = new Blob([buffer], { type: "file/pdf" });

  //   // diganti jadi url db nanti
  //   // let storage = urlDB nya
  //   // let storage = firebase.storage();
  //   let storage = this.globalService.getApiUrl + '/upload.php';

  //   storage.ref('file/' + name).put(blob).then((d) => {
  //     alert("Done");
  //   }).catch((error) => {
  //     alert(JSON.stringify(error))
  //   })

  // }

  chooseFile() {
  if (this.platform.is("ios")) {
      this.filePicker.pickFile().then(uri =>
        this.filePath.resolveNativePath(uri).then((nativepath) => {
          this.fileTransfer = this.transfer.create();
          let options: FileUploadOptions = {
            fileKey: 'file',
            fileName: this.profile.fullname + '_cv.pdf',
            chunkedMode: false,
            mimeType: 'file/pdf'
          }
          this.fileTransfer.upload(nativepath, this.globalService.getApiUrl() + '/upload.php', options).then((data) => {
            alert("file uploaded");
          }, (err) => {
            alert(JSON.stringify(err));
          })
        }, (err) => {
          alert(JSON.stringify(err));
        }))
    }
    if (this.platform.is("android")) {
      this.fileChooser.open().then(uri => {
        // this.filePath.resolveNativePath(uri).then((nativepath) => {
        this.fileURL = uri;
        this.fileTransfer = this.transfer.create();
        let options: FileUploadOptions = {
          fileKey: 'file',
          fileName: this.profile.fullname + '_cv.pdf',
          chunkedMode: false,
          mimeType: 'file/pdf'
        }
        //native path bisa diganti sama this.fileURL
        this.fileTransfer.upload(this.fileURL, this.globalService.getApiUrl() + '/upload.php', options).then((data) => {
          alert("file uploaded");
        }, (err) => {
          alert(JSON.stringify(err));
        })
      }, (err) => {
        alert(JSON.stringify(err));
      })
    }

  }
  
  async saveProfile() {
    let loading = await this.loadingCtrl.create();
    await loading.present();
    let formData = this.editProfileForm.value;
    formData.date_of_birth = formData.date_of_birth.substr(0, 10);
    if (!this.profilePictureChanged) {
      formData.profile_picture = '';
      formData.profile_picture_url = '';
    }
    formData.resume = this.base64s;

    let token = this.auth.token;

    let url = this.globalService.getApiUrl() + 'api/profile?X-Api-Key=' + this.globalService.getGlobalApiKey() + '&X-Token=' + token;
    this.http.put(url, formData).pipe(
      finalize(() => this.loadingCtrl.dismiss())
    )
      .subscribe(data => {    
        console.log(this.profile);
        this.presentToast(data["message"]);
        this.globalService.refreshFlag.home = true;
        this.globalService.refreshFlag.profile = true;
        this.navCtrl.back();
      }, err => {
        console.log('JS Call error: ', err);

        let message = "";
        if (err.error.message === undefined)
          message = "Permasalahan jaringan, mohon coba lagi.";
        else
          message = err.error.message;

        this.presentToast(message);
      });

  }
  async presentToast(message) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  async presentAlertConfirm() {
    console.log(this.profile);
    const alert = await this.alertCtrl.create({
      message: 'Apakah kamu yakin ingin keluar tanpa menyimpan?',
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Ya',
          handler: () => {
            this.router.navigateByUrl('app/user');
          }
        }
      ]
    });

    await alert.present();
  }

}

