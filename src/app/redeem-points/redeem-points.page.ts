import { Component, OnInit } from '@angular/core';
import { CartService } from './cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redeem-points',
  templateUrl: './redeem-points.page.html',
  styleUrls: ['./redeem-points.page.scss'],
})
export class RedeemPointsPage implements OnInit {
  garenaImg: string = "../../assets/images/Garena.PNG";
  steamImg: string = "../../assets/images/Steam.PNG";
  garudaImg: string = "../../assets/images/garuda.png";
  travelokaImg: string = "../../assets/images/traveloka.jpg";
  products: Array<{name: string, price: number, description: string, id: string}> = []
  queryRes : Array<any>;
  searchQuery: String;
  setHidden: boolean;
  hasSearched : boolean;
  
  length : any;
  constructor(public cartService: CartService, public router: Router) { }

  ngOnInit() {
    this.products = this.cartService.getProducts();
    this.setHidden = false;
    this.hasSearched = false;
  }
  sliderConfig = {
    slidesPerView: 3,
    spaceBetween: 0.2,
    initialSlide: 0
  }
  search(ev: any){
    this.searchQuery = ev.detail.value;
    console.log(this.searchQuery);
    this.setHidden = true;
    if(!this.searchQuery){
      this.setHidden = false;
      this.hasSearched = false;
      return this.queryRes = [];
    }
    this.queryRes = this.products.filter((item) => {
      return item.name.toLowerCase().indexOf(this.searchQuery.toLowerCase()) > -1;
    });
    this.length = this.queryRes.length;
    if(this.searchQuery.length > 0){
      if(this.length <= 0){
        this.hasSearched = true;
      }else{
        this.hasSearched = false;
      }
    }else if(this.searchQuery.length <= 0){
      this.hasSearched = false;
    }
  }
  hideSearchResult(){
    this.hasSearched = false;
  }
  blurSearchbar(){
    this.setHidden = false;
    this.hasSearched = false;
  }
  focusSearchbar(){
    this.setHidden = true;
    this.hasSearched = false;
  }
  return(){
      if(this.cartService.toast != null){
        this.cartService.toast.dismiss(); 
      }
      this.cartService.cart = [];
      this.cartService.cartAdded = false;
      this.cartService.products.forEach((element, index) => {
        this.cartService.products[index].amount = 0;
      });
  }
  checkVoucher(){
    this.router.navigateByUrl('app/user/redeem-points/redeem-history');
  }
}
  
