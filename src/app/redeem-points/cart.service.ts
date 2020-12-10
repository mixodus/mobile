import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastController, NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { count } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  products: Array<{ name: string, price: number, description: string, category: string, id: string, amount: number }> = [
    {
      name: "Lazada",
      price: 50000,
      description: "Kupon Diskon 50% di Lazada",
      category: "Shopping",
      id: "1",
      amount: 0,
    },
    {
      name: "Grab",
      price: 60000,
      description: "Dapatkan voucher GrabCar 20 buah",
      category: 'Transportation',
      id: "2",
      amount: 0,
    },
    {
      name: "H&M",
      price: 55000,
      description: "Cashback 60% untuk sekali belanja",
      category: "Shopping",
      id: "3",
      amount: 0
    },
    {
      name: "H&M",
      price: 55000,
      description: "Cashback 60% untuk sekali belanja",
      category: "Shopping",
      id: "4",
      amount: 0
    },
    {
      name: "Garuda Indonesia",
      price: 55000,
      description: "Dapatkan 1000 GarudaMiles",
      category: "Travel",
      id: "5",
      amount: 0
    },
    {
      name: "Traveloka",
      price: 55000,
      description: "Dapatkan voucher hotel 100rb",
      category: "Travel",
      id: "6",
      amount: 0
    },
    {
      name: "Google Play",
      price: 55000,
      description: "Voucher Google Play 20rb",
      category: "Games & Entertainment",
      id: "7",
      amount: 0
    },
    {
      name: "Steam",
      price: 55000,
      description: "Voucher Steam Wallet 1$",
      category: "Games & Entertainment",
      id: "8",
      amount: 0
    },
    {
      name: "Udemy",
      price: 55000,
      description: "Discount 50% for annual Payment on Ruby on Rails Course",
      category: "Education",
      id: "9",
      amount: 0
    },
    {
      name: "RuangGuru",
      price: 55000,
      description: "3 Months free for any course",
      category: "Education",
      id: "10",
      amount: 0
    },
    {
      name: "Burger King",
      price: 55000,
      description: "Voucher 50rb",
      category: "Food",
      id: "11",
      amount: 0
    },
    {
      name: "Pizza Marzano",
      price: 55000,
      description: "Voucher 25rb",
      category: "Food",
      id: "12",
      amount: 0
    }
  ];
  cart: Array<{ name: string, price: number, description: string, category: string, id: string, amount: number }> = [];
  // cartItemCount = new BehaviorSubject(0);
  cartAdded: boolean = false;
  TotalPrice: number = 0;
  // deleted: boolean = false;
  // added: boolean = false;
  toast: any;
  constructor(public toastController: ToastController, public router: Router, public navCtrl: NavController, public route: ActivatedRoute) { }
  getProducts() {
    return this.products;
  }
  getCart() {
    return this.cart;
  }
  // getCartItemCount() {
  //   return this.cartItemCount;
  // }
  openCart() {
    this.router.navigateByUrl('/app/user/redeem-points/redeem-menu/redeem-detail');
    this.countTotalPrice();
  }
  // calculateTotalAmount(a, b) {
  //   return a + b;
  // }
  addProduct(product) {
    let added = false;
    for (let c of this.cart) {
      if (c.id === product.id) {
        c.amount++;
        if (c.amount === undefined || c.amount === NaN) {
          c.amount = 0
        }
        added = true;
        break;
      }
    }
    if (!added) {
      product.amount++;
      this.cart.push(product);
    }
    if (this.cartAdded === false) {
      this.cartAdded = true;
    }
    // console.log(this.cart);
  }
  decreaseProduct(pid) {
    // this.deleted = false;
    for (let c of this.cart) {
      if (c.id === pid) {
        c.amount--;
        if (c.amount < 0) {
          c.amount = 0;
        } else if (c.amount === 0) {
          // this.deleted = true;
          this.cart.splice(this.cart.indexOf(c), 1);
        }
      }
    }
    if (this.cart.length === 0) {
      this.cartAdded = false;
      this.toast.dismiss();
    }
    // for(let p of this.cart){
    //   if(p.amount === 1){
    //     this.cart.splice(this.cart.indexOf(p));
    //   }
    // }
    // console.log(this.cart);
  }

  showProductAmountInCart(pid) {
    for (let j = 0; j < this.cart.length; j++) {
      if (pid === this.cart[j].id) {
        return this.cart[j].amount
      }
    }
    return 0
  }

  getProduct(pid){
    for (let j = 0; j < this.products.length; j++) {
      if (pid === this.products[j].id) {
        return this.products[j]
      }
    }
    return null
  }

  countTotalPrice() {
    if (this.TotalPrice !== 0) {
      this.TotalPrice = 0;
    }
    for (var p of this.cart) {
      this.TotalPrice += ((p.amount) * p.price);
    }
  }
  // async presentToastWithOptions() {
  //   this.toast = await this.toastController.create({
  //     animated: true,
  //     mode: "ios",
  //     message: '<b> Item added</b> <br> Click to see detailed Cart ',
  //     position: 'bottom',
  //     buttons: [
  //       {
  //         side: 'start',
  //         icon: 'cart',
  //         handler: () => {
  //           this.openCart();
  //         },
  //       }
  //     ]
  //   });
  //   this.toast.present();
  // }
  // showOnceToast(){
  //   this.toastController.dismiss().then((obj)=>{
  //   }).catch(()=>{
  //   }).finally(()=>{
  //     this.presentToastWithOptions();
  //   });
  // }
}
