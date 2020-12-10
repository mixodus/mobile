import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordValidator } from '../validators/password.validator';
import { Router , ActivatedRouteSnapshot} from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  resetPasswordForm: FormGroup;
  matching_passwords_group: FormGroup;
  code : string;
  data: any;
  validation_messages = {
    'password': [
      { type: 'required', message: 'Password dibutuhkan.' },
      { type: 'minlength', message: 'Password minimal 5 karakter.' }
    ],
    'confirm_password': [
      { type: 'required', message: 'Konfirmasi Password dibutuhkan.' }
    ],
    'matching_passwords': [
      { type: 'areNotEqual', message: 'Password tidak cocok.' }
    ]
  };
  constructor(
    private router: Router,
    private route: ActivatedRouteSnapshot
  ) {

    this.matching_passwords_group = new FormGroup({
      'password': new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required,
      ])),
      'confirm_password': new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areNotEqual(formGroup);
    });

    this.resetPasswordForm = new FormGroup({
      'password': new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required,
      ])),
      'confirm_password': new FormControl('', Validators.required),
      'matching_passwords': this.matching_passwords_group
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areNotEqual(formGroup);
    });
  }

  ngOnInit() {
  }

  resetPassword(): void {

    this.router.navigate(['auth/login']);
  }

}
