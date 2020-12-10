import { Component, OnInit } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { ToastController, ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';
import { BehaviorSubject } from 'rxjs';
import { RedeemItemInfoComponent } from '../redeem-item-info/redeem-item-info.component';

@Component({
  selector: 'app-redeem-menu',
  templateUrl: './redeem-menu.page.html',
  styleUrls: ['./redeem-menu.page.scss'],
})
export class RedeemMenuPage implements OnInit {
  products: Array<{name: string, price: number, description: string, id: string, amount: number}> = []
  cart : Array<{name: string, price: number, description: string, id: string, amount: number}> = []
  // cartItemCount : BehaviorSubject<number>;
  cartAdded : boolean;
  confirmEmpty : boolean;
  itemPicture : string = "../../../assets/images/crown-gold.png";
  constructor(public toastController: ToastController, public router: Router, public cartService: CartService, public modalController: ModalController, public navCtrl: NavController) { }

  ngOnInit() {
    this.products = this.cartService.getProducts();
    this.cart = this.cartService.getCart();
    // this.cartItemCount = this.cartService.getCartItemCount();
    this.cartAdded = this.cartService.cartAdded;
    // this.confirmEmpty = false;
    // if(this.cart === null){
    //   this.confirmEmpty = true;
    //   this.cart = [];
    //   this.products.forEach((item, index) => {
    //     item.amount[index] === 0;
    //   })
    // }
  }

  addToCart(pid){
    const product = {
      id : this.products[pid].id,
      name : this.products[pid].name,
      price: this.products[pid].price,
      description: this.products[pid].description,
      amount: this.products[pid].amount
    }
    this.cartService.addProduct(product);
  }
  decreaseCart(pid){
    this.cartService.decreaseProduct(pid);
  }
  ionViewDidEnter(){
    if(this.cart.length > 0){
      this.cartAdded = true;
    }
  }
  // presentModal(id){
  //   const modal = await this.modalController.create({
  //     component: RedeemItemInfoComponent,
  //     cssClass:  'my-custom-modal-css',
  //     mode: 'ios',
  //     componentProps: {
  //       'name' : this.products[id-1].name,
  //       'description' : this.products[id-1].description,
  //       'price' : this.products[id-1].price,
  //       'amount' : this.products[id-1].amount,
  //       'id' : id,
  //     } 
  //   });
  // }
    // modal.onDidDismiss().then((product) => {
    //   this.router.navigate(['app/referral']);
    //     this.addToCart(product);
    //     console.log(product);
    //   this.navCtrl.back();
    // });
  }
  // async presentToastWithOptions() {
  //   const toast = await this.toastController.create({
  //     animated: true,
  //     mode: "ios",
  //     message: '<b> Item added </b> <br> Click to see detailed Cart ',
  //     position: 'bottom',
  //     buttons: [
  //       {
  //         side: 'start',
  //         icon: 'cart',
  //         handler: () => {
  //           this.cartService.openCart();
  //         },
  //       }
  //     ]
  //   });
  // }
