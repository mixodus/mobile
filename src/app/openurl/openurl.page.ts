import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuController,  } from '@ionic/angular';
import { ThemeableBrowser, ThemeableBrowserOptions, ThemeableBrowserObject } from '@ionic-native/themeable-browser/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './openurl.page.html',
  styleUrls: [
    './styles/openurl.page.scss'
  ]
})
export class OpenurlPage implements OnInit {
 
  title:string ="";
  

 

  constructor(
    public router: Router,
    public menu: MenuController,
    private route:ActivatedRoute,
    private themeableBrowser: ThemeableBrowser
  ) {

    this.route.queryParams.subscribe(params =>{
        if(params && params.data) {
          
        }
    })
  }

  ngOnInit(): void {
    this.menu.enable(false);
  }
}
