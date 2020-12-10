import { Component, OnInit } from '@angular/core';
import { Router, Navigation } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  constructor(private _router: Router) {
    this.prevNav = this._router.getCurrentNavigation().previousNavigation;
  }

  prevNav: Navigation;

  ngOnInit() {}

  onBackClicked() {
    try {
      this._router.navigateByUrl(this.prevNav.finalUrl);
    } catch {
      this._router.navigate(['app/user']);
    }
  }
}
