import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { BehaviorSubject } from 'rxjs';
import { RedeemItemInfoComponent } from '../redeem-item-info/redeem-item-info.component';
import { ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redeem-detail',
  templateUrl: './redeem-detail.page.html',
  styleUrls: ['./redeem-detail.page.scss'],
})
export class RedeemDetailPage implements OnInit {
  products: Array<{ name: string; price: number; description: string; id: string }> = [];
  cart: Array<{
    name: string;
    price: number;
    description: string;
    id: string;
    amount: number;
  }> = [];
  // cartItemCount : BehaviorSubject<number>;
  totalPrice: number;
  status: boolean = false;

  constructor(
    public cartService: CartService,
    public modalController: ModalController,
    public router: Router,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    this.products = this.cartService.getProducts();
    this.cart = this.cartService.getCart();
    // this.cartItemCount = this.cartService.getCartItemCount();
    this.totalPrice = this.cartService.TotalPrice;
    console.log(this.totalPrice);
  }
  async presentModal(id) {
    const modal = await this.modalController.create({
      component: RedeemItemInfoComponent,
      cssClass: 'my-custom-modal-css',
      mode: 'ios',
      componentProps: {
        name: this.products[id - 1].name,
        description: this.products[id - 1].description,
        price: this.products[id - 1].price,
      },
    });

    // modal.onDidDismiss().then((product) => {
    //   this.router.navigate(['app/referral']);
    //     console.log(product);
    //   this.navCtrl.back();
    // });
    return await modal.present();
  }
  ionViewDidEnter() {
    if (this.cartService.toast != null) {
      this.cartService.toast.dismiss();
    }
  }
  addToCart(product) {
    this.cartService.addProduct(product);
    this.cartService.countTotalPrice();
  }
  decreaseCart(product) {
    this.cartService.decreaseProduct(product.id);
    this.cartService.countTotalPrice();
  }
  async confirm() {
    const toast = await this.toastController.create({
      message: 'You have redeem your points successfully',
      duration: 2000,
    });
    toast.present();
    let length = this.cartService.cart.length;
    this.cartService.cart.forEach((element, index) => {
      this.cartService.cartAdded = false;
      this.cartService.products[index].amount = 0;
    });
    this.cartService.cart.splice(0, length);
    this.router.navigateByUrl('app/user/redeem-points');
  }
  addMoreProduct() {
    this.router.navigateByUrl('app/user/redeem-points');
  }

  recreateToast() {}
}
