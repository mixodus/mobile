import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { CartService } from '../cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redeem-item-info',
  templateUrl: './redeem-item-info.component.html',
  styleUrls: ['./redeem-item-info.component.scss'],
})
export class RedeemItemInfoComponent implements OnInit {
  @Input() name: string;
  @Input() description: string;
  @Input() price: string;
  @Input() amount : number;
  @Input() id : number;
  routingUrl: string;
  product : {}
  constructor(private modalCtrl: ModalController, private cartService: CartService, private navParams: NavParams, private router : Router) {
  }

  ngOnInit() {
    // console.log(this.name)
    // console.log(this.description)
    // console.log(this.price)
    // console.log(this.amount)
    // console.log(this.id);
    // console.log('this.router.url', this.router.url);
    this.routingUrl = this.router.url;
  }
  close(){
    this.product = {
      name: this.name,
      description : this.description,
      price: this.price,
      amount : this.amount,
      id : this.id
    }
    this.cartService.addProduct(this.product);
    return this.modalCtrl.dismiss({
      'dismissed' : true
    });
  }
  decreaseCart(){
    let found = this.cartService.cart.find(element => element.name === this.name)
    this.cartService.cart.forEach((element, i) => {
      if(found){
        this.cartService.cart.splice(i, 1);
      }
    })
    return this.modalCtrl.dismiss({
      'dismissed' : true,
    }).then((data) =>{
      this.cartService.countTotalPrice();
      console.log(this.cartService.TotalPrice);
    });
  }
}
