import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-app',
  templateUrl: './update-app.page.html',
  styleUrls: ['./update-app.page.scss'],
})
export class UpdateAppPage implements OnInit {

  details:any;
  constructor(private route: ActivatedRoute,private router: Router) { 

    this.route.queryParams.subscribe(params => {
     
      if (this.router.getCurrentNavigation().extras.state) {
        this.details = this.router.getCurrentNavigation().extras.state.data;
       
      }
    });
  }

  ngOnInit() {
  }

}
