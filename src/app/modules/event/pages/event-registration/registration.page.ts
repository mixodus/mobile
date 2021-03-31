import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { EventsResponse } from '../../../../core/models/event/EventResponse';
import { ShellModel } from '../../../../shell/data-store';
import { EventType } from '../../../../core/constants/event-type.enum';
import * as moment from 'moment';
import { EventsService } from '../../services/events.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../../services/auth/authentication.service';
import { AddressService } from '../../../../core/services/address/address.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ICountry } from '../../../../core/models/country/ICountry';
import { CountryResponse } from '../../../../core/models/country/CountryResponse';
import { GlobalService } from '../../../../services/global.service';
import { UserProfileModel } from '../../../../user/profile/user-profile.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./styles/registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  constructor(
    private _eventService: EventsService,
    private _addressService: AddressService,
    private _route: ActivatedRoute,
    private _navCtrl: NavController,
    private _fb: FormBuilder,
    private _auth: AuthenticationService,
    private _alertCtrl: AlertController,
    private _globalService: GlobalService
  ) {
  }

  destroySubscription = new Subject<any>();
  isSending = false;

  currentUser;
  event: EventsResponse & ShellModel;

  currentDate = new Date();

  countries: Array<{ code: string, name: string }>;

  // countriesResponse: CountryResponse & ShellModel;

  registrationForm = this._fb.group({
    event_id: [null, Validators.required],
    email: [null, Validators.required],
    fullname: [null, Validators.required],
    date_of_birth: [this.dateOfBirth, Validators.required],
    address: [null, Validators.required],
    country: [null, Validators.required],
    city: [null, Validators.required],
    gender: [null, Validators.required],
  });

  validation_messages = {
    event_id: [{ type: 'required', message: 'Event dibutuhkan.' }],
    email: [{ type: 'required', message: 'Email dibutuhkan.' }],
    fullname: [{ type: 'required', message: 'Nama Lengkap dibutuhkan.' }],
    address: [{ type: 'required', message: 'Alamat dibutuhkan.' }],
    country: [{ type: 'required', message: 'Negara dibutuhkan.' },],
    city: [{ type: 'required', message: 'Kota dibutuhkan.' }],
    gender: [{ type: 'required', message: 'Jenis Kelamin.' }],
  };

  ngOnInit(): void {
    this.countries = this._globalService.countriesArr;
  }

  ionViewWillEnter() {
    // this.refresher.disabled = false;

    this.fetchData();
  }

  ionViewWillLeave() {
    // this.refresher.disabled = true;
    this.destroySubscription.next();
  }

  // - getter & setter -
  get dateOfBirth() {
    try {
      const formValue = this.registrationForm.get('date_of_birth').value;

      const momentobject = moment(formValue, 'YYYY-MM-DD');

      return momentobject.toDate().toISOString();
    } catch {
      return this.currentDate.toISOString();
    }
  }

  get gender() {
    try {
      const formValue = this.registrationForm.get('gender').value;

      if (formValue) {
        return formValue;
      }
      return 'Female';
    } catch {
      return 'Female';
    }
  }

  // get countries(): ICountry[] {
  //   if (this.countriesResponse) return this.countriesResponse.data;

  //   return [];
  // }

  // get isDisabled(): boolean {
  //   if (this.event == undefined) return true;

  //   return this.isSending || this.event.isShell;
  // }

  getImage() {
    try {
      if (this.event) {
        return this._eventService.getEventImage(this.event.data[0].event_banner);
      } else {
        return '';
      }
    } catch {
      return '';
    }
  }

  getDate(stringDate: string) {
    try {
      if (stringDate) {
        return moment(stringDate, 'YYYY-MM-dd').toDate();
      } else {
        return new Date();
      }
    } catch {
      return new Date();
    }
  }

  getEventType(eventType: string) {
    switch (+eventType) {
      case EventType.Event:
        return 'Event';
      case EventType.Bootcamp:
        return 'Bootcamp';
      case EventType.Challenge:
        return 'Challenge';
      default:
        return 'Event';
    }
  }

  prefillForm() {
    this.registrationForm.patchValue({
      email: this.currentUser.email,
      fullname: this.currentUser.fullname,
      date_of_birth: this.currentUser.date_of_birth,
      address: this.currentUser.address,
      country: this.currentUser.country,
      city: this.currentUser.province,
      gender: this.currentUser.gender,
    });

    this.registrationForm.updateValueAndValidity();
  }

  prefillFormEventId() {
    this.registrationForm.patchValue({
      event_id: this.event.data[0].event_id,
    });

    this.registrationForm.updateValueAndValidity();
  }

  fetchData() {
    // this._auth.user.subscribe((res) => {
    //   this.currentUser = res.user;

    //   console.log(this.currentUser);

    //   this.prefillForm();
    // });

    this._route.data.subscribe((resolvedData) => {
      resolvedData.profile.state.pipe(takeUntil(this.destroySubscription)).subscribe(
        (profile: UserProfileModel & ShellModel) => {
          this.currentUser = profile;

          if (this.currentUser) {
            // console.log(this.currentUser);
            this.prefillForm();
          }
        },
        (err) => {
          console.error(err);
        }
      );
    });

    this._route.data.subscribe((resolvedData) => {
      resolvedData.event.state.pipe(takeUntil(this.destroySubscription)).subscribe(
        (event: EventsResponse & ShellModel) => {
          this.event = event;

          if (this.event.data[0]) {
            this.prefillFormEventId();
          }
        },
        (err) => {
          console.error(err);
        }
      );
    });

    // this._addressService
    //   .getCountriesDataStore()
    //   .state.pipe(takeUntil(this.destroySubscription))
    //   .subscribe((res) => {
    //     this.countriesResponse = res;

    //     console.log(this.countries);
    //   });
  }

  goBack() {
    this._navCtrl.back();
  }

  registerToEvent() {
    const fv = this.registrationForm.value;

    this._eventService
      .register(fv)
      .pipe(takeUntil(this.destroySubscription))
      .subscribe(
        async (res) => {
          // console.log(res);

          const alert = await this._alertCtrl.create({
            message:
              '<div class="message-body"><img src="assets/new-assets/success.png" class="image" /><p class="title">Terimakasih!</p><p class="content">Pendaftaran Anda menunggu untuk disetujui.</p></div>',
            cssClass: 'idstar-custom-alert',
            buttons: [
              {
                cssClass: 'idstar-custom-alert-action',
                text: 'Kembali',
                handler: () => {
                  this._navCtrl.navigateForward(['/app/events']);
                },
              },
            ],
          });

          await alert.present();
        },
        (err) => {
          console.error(err);
        }
      );
  }

  onCancelRegister() {
    this.goBack();
  }

  async onRegister() {

    // console.log(this.registrationForm.value);
    if (this.registrationForm.valid) {
      // console.log(this.registrationForm.value);
      const alert = await this._alertCtrl.create({
        message: 'Apakah kamu yakin ingin mendaftar?',
        buttons: [
          {
            text: 'Tidak',
            role: 'cancel',
          },
          {
            text: 'Ya',
            handler: () => {
              this.registerToEvent();
            },
          },
        ],
      });

      await alert.present();
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  onDateChange(event: string) {
    const momentObj = moment(event);

    this.registrationForm.patchValue({
      date_of_birth: momentObj.format('YYYY-MM-dd'),
    });
  }
}
