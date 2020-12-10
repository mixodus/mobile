import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CartService } from '../cart.service';
import { Storage } from '@ionic/storage';

@Injectable()
export class RedeemItemResolver implements Resolve<any> {
  token : String;
  constructor(private cartService : CartService, private storage : Storage) {  
  }

  product: {};

  resolve(route: ActivatedRouteSnapshot) {
    const product_id = route.params['id'];
    this.product = this.cartService.getProduct(product_id)
    return this.product;
  }
}
