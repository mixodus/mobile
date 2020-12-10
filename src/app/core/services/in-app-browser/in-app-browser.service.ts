import { Injectable } from '@angular/core';
import { InAppBrowserObject, InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root',
})
export class InAppBrowserService {
  constructor(private _inAppBrowser: InAppBrowser) {}

  private _browserInstance: InAppBrowserObject = null;

  openBrowser(url: string) {
    if (this._browserInstance) {
      this._browserInstance.close();
    }

    this._browserInstance = this._inAppBrowser.create(url);
  }
}
