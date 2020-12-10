import { Component, OnInit, AfterViewInit, ViewChild, HostBinding } from '@angular/core';

import { IonSlides, MenuController, NavController } from '@ionic/angular';

;

@Component({
  selector: 'app-walkthrough',
  templateUrl: './walkthrough.page.html',
  styleUrls: [
    './styles/walkthrough.page.scss',
    './styles/walkthrough.shell.scss',
    './styles/walkthrough.responsive.scss'
  ]
})
export class WalkthroughPage implements OnInit {
  slidesOptions: any = {
    zoom: {
      toggle: false // Disable zooming to prevent weird double tap zomming on slide images
    }
  };

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  @HostBinding('class.first-slide-active') isFirstSlide = true;

  @HostBinding('class.last-slide-active') isLastSlide = false;

  constructor(public menu: MenuController, public router: NavController) {
  }

  ngOnInit(): void {
    this.menu.enable(false);
  }

  navigateToLogin() {
    this.router.navigateForward('auth/login');
    this.menu.enable(true);
  }
}
