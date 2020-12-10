import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { take, map } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private auth: AuthenticationService, private alertCtrl: AlertController, private storage: Storage) { 
  }

  canActivate(route: ActivatedRouteSnapshot) {
    return this.auth.user.pipe(
      take(1),
      map(user => {
        this.auth.token = user.token;
        this.storage.get("showIntro").then((result) => {
          if(result === null){
            this.storage.set("showIntro", true);
            return this.router.parseUrl('/walkthrough');
          }
        })    
        if (!this.auth.token) {
            return this.router.parseUrl('/walkthrough');
        // } else if (!this.auth.checkExpiredToken()) {
        //   this.showAlert();
        //   return this.router.parseUrl('/auth/login')
        }else{
          // return this.router.parseUrl('/walkthrough');
          return true;
        }
        // if (!user) {
        //   this.showAlert();
        //    return this.router.parseUrl('/auth/login')
        // } else {
        //   if(user.token == null)
        //       return this.router.parseUrl('/walkthrough')
        //   else 
        //     return true;
        // }
      })
    )

  }

  async showAlert() {
    let alert = await this.alertCtrl.create({
      header: 'Unauthorized',
      message: 'You are not authorized to visit that page because your token ran out!',
      buttons: ['OK']
    });
    alert.present();
  }


}
