import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController, ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-redeem-item',
  templateUrl: './redeem-item.page.html',
  styleUrls: ['./redeem-item.page.scss'],
})
export class RedeemItemPage implements OnInit {
  currentPoint = 150;
  product = null;

  constructor(
    private cartService: CartService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private navCtrl: NavController,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.route.data.subscribe((resolvedRouteData) => {
      this.product = resolvedRouteData['data'];
    });
  }

  async presentToastInfo() {
    const toast = await this.toastCtrl.create({
      message: 'You have redeem your points successfully',
      duration: 2000,
    });
    toast.present();
  }
  async presentLoading() {
    const load = await this.loadingCtrl.create({
      showBackdrop: true,
      spinner: 'lines',
      message: 'Please wait',
      duration: 2100,
    });
    load.present();
  }

  async addToCart() {
    // this.cartService.addProduct(this.product);
    const alert = await this.alertController.create({
      header: 'Get this reward',
      message: 'Are you sure you want to redeem?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: (blah) => {
            this.presentLoading();
            setTimeout(() => {
              this.router.navigateByUrl('/app/user/redeem-points');
              this.presentToastInfo();
            }, 2000);
          },
        },
      ],
    });
    alert.present();
  }
}
