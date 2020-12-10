import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController, Platform } from '@ionic/angular';
import { ShellModel } from '../../../../shell/data-store';
import * as moment from 'moment';
import { CertificationService } from '../certification.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GlobalService } from '../../../../services/global.service';
import { CertificationResponse } from '../../../../core/models/certification/CertificationResponse';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { HttpClient } from '@angular/common/http';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';

@Component({
    selector: 'app-edit-certification',
    templateUrl: './edit-certification.page.html',
    styleUrls: ['./edit-certification.page.scss'],
})
export class EditCertificationPage implements OnInit {
    data: any;

    constructor(
        private _certificationService: CertificationService,
        private _route: ActivatedRoute,
        private router: Router,
        private _navCtrl: NavController,
        private _fb: FormBuilder,
        private _auth: AuthenticationService,
        private _alertCtrl: AlertController,
        private _globalService: GlobalService,
        private _router: Router,
        private _http: HttpClient,

        private fileChooser: FileChooser,
        private transfer: FileTransfer,
        private platform: Platform,
        private filePath: FilePath,
        private file: File,
        private filePicker: IOSFilePicker
    ) {
        this._route.queryParams.subscribe(params => {
            if (this.router.getCurrentNavigation().extras.state) {
                this.data = this.router.getCurrentNavigation().extras.state.data;
            }
            console.log('this.data: ', this.data);
        });
    }

    destroySubscription = new Subject<any>();
    isSending = false;

    currentUser: any;
    certif: CertificationResponse & ShellModel;
    response: any;
    id: any;

    fileURL: string;
    filepath: any;
    filetype: any;
    bool: boolean = true;
    fileTransfer: FileTransferObject;


    certificationForm = this._fb.group({
        title: [null, Validators.required],
        description: [null, Validators.required],
        certification_date: [null, Validators.required],
        certification_id: [null, Validators.required]
    });

    validation_messages = {
        title: [{ type: 'required', message: 'Gelar dibutuhkan.' }],
        description: [{ type: 'required', message: 'Deskripsi dibutuhkan.' }],
        certification_date: [{ type: 'required', message: 'Tanggal Penerimaan dibutuhkan.' }]
    };

    ngOnInit(): void {
        this._route.queryParams.pipe(takeUntil(this.destroySubscription)).subscribe(params => {
            if (this._router.getCurrentNavigation().extras.state) {
                this.currentUser = this._router.getCurrentNavigation().extras.state.data;
                console.log(this.currentUser);
                this.prefillForm();
            }
        });
    }
    ionViewWillLeave() {
        this.destroySubscription.next();
    }

    prefillForm() {
        this.certificationForm.patchValue({
            certification_id: this.currentUser.certification_id,
            title: this.currentUser.title,
            description: this.currentUser.description,
            certification_date: this.currentUser.certification_date,
        });

        this.certificationForm.updateValueAndValidity();
        console.log(this.certificationForm.value);
    }

    getfileName() {
        if (this.currentUser != null && (this.fileURL == null || this.fileURL == undefined))
            return this.currentUser.certification_file

        if (this.fileURL != undefined && this.fileURL != null)
            //  proses file url => ambil file name
            return this.filepath
    }

    goBack() {
        this._router.navigateByUrl('app/user/certification');
    }

    save() {
        console.log(this.certificationForm.value);
        const fv = this.certificationForm.value;

        if (this.bool == true) {
            console.log("masuk");
            this._certificationService
                .register(fv)
                .pipe(takeUntil(this.destroySubscription))
                .subscribe(
                    async (res) => {
                        console.log(res);
                        if (this.currentUser == null) {
                            this.response = res;
                            console.log(this.response);
                            this.id = this.response.data.id;
                            console.log(this.id);
                            this.transferFile(this.id);
                        }
                        else {
                            if (this.fileURL != null && this.fileURL != undefined) {
                                this.transferFile(this.currentUser.certification_id);
                            }
                            alert("file updated");
                            this._router.navigateByUrl('app/user/certification');
                        }
                    },
                    (err) => {
                        console.error(err);
                    }
                );
        } else{
            alert("Mohon mengunggah file pdf anda.");
        }
    }

    
    chooseFile() {
        if (this.platform.is("ios")) {
            this.filePicker.pickFile().then(uri => {
                this.bool = true;
                this.fileURL = uri;
                console.log(this.fileURL);
                this.filePath.resolveNativePath(uri)
                    .then((path) => {
                        console.log(path)
                        const index = path.lastIndexOf('/')
                        this.filepath = path.substr(index + 1)

                        this.filetype = this.filepath.substr(this.filepath.lastIndexOf('.') + 1)

                        if (this.filetype != 'pdf') {
                            alert("Mohon menggunakan file pdf.");
                            this.bool = false;
                        }
                        // else {
                        //     this.bool = true;
                        // }

                        this.file.resolveLocalFilesystemUrl(this.fileURL).then(fileEntry => {
                            fileEntry.getMetadata((metadata) => {
                                console.log(metadata.size);
                                //metadata.size is the size in bytes
                                if (metadata.size > 1000000) {
                                    alert("Mohon menggunakan file size yang lebih kecil.");
                                    this.bool = false;
                                }
                                // else {
                                //     this.bool = true;
                                // }
                            })
                        })

                    })
            })
        }
        if (this.platform.is("android")) {
            this.fileChooser.open().then(uri => {
                this.bool = true;
                this.fileURL = uri;
                console.log(this.fileURL);
                this.filePath.resolveNativePath(this.fileURL)
                    .then(path => {
                        console.log(path)
                        const index = path.lastIndexOf('/')
                        this.filepath = path.substr(index + 1)

                        this.filetype = this.filepath.substr(this.filepath.lastIndexOf('.') + 1)

                        if (this.filetype != 'pdf') {
                            alert("Mohon menggunakan file pdf.");
                            this.bool = false;
                            console.log(this.bool);
                        }
                        
                        this.file.resolveLocalFilesystemUrl(this.fileURL).then(fileEntry => {
                            fileEntry.getMetadata((metadata) => {
                                console.log(metadata.size);
                                //metadata.size is the size in bytes
                                if (metadata.size > 1000000) {
                                    alert("Mohon menggunakan file size yang lebih kecil.");
                                    this.bool = false;
                                    console.log(this.bool);
                                }
                            })
                        })
                        console.log(this.bool);
                    })
                    .catch(err => console.log(err));
            }, (err) => {
                alert(JSON.stringify(err));
            })
        }

    }

    transferFile(id) {
        console.log(this.fileURL);
        this.fileTransfer = this.transfer.create();
        let options: FileUploadOptions = {
            fileKey: 'userfile',
            fileName: "file.pdf",
            chunkedMode: false,
            mimeType: 'application/pdf'
        }
        var url = encodeURI(this._globalService.getApiUrl() + 'upload/upload/' + id);

        this.fileTransfer.upload(this.fileURL, url, options).then((data) => {
            alert("File berhasil diupload.");
            this._router.navigateByUrl('app/user/certification');
        }, (err) => {
            alert(JSON.stringify(err));
        })

    }

}
