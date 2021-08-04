import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicStorageModule } from '@ionic/storage';
import { ThemeableBrowser } from '@ionic-native/themeable-browser/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
// import { InterceptorProvider } from './provider/interceptor/interceptor';
import { SafeHtmlPipe } from './safe-html.pipe';
// import { NetworkServiceProviderService } from './network-service-provider.service';
import { Network } from '@ionic-native/network/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { PopoverPageModule } from './popover/popover.module';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { IOSFilePicker } from '@ionic-native/file-picker/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { JobsPageModule } from './jobs/jobs.module';

import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';

import { OneSignal } from '@ionic-native/onesignal/ngx';
import {HomeService} from './home/home.service';

import { Market } from '@ionic-native/market/ngx';
import { ConnectionService } from './connection/connection.service';
import { UserService } from './user/user.service';
import { LevelService } from './level/level.service';


registerLocaleData(localeId, 'id');

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent, SafeHtmlPipe],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    ReactiveFormsModule,
    AppRoutingModule,
    ComponentsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    PopoverPageModule,
    JobsPageModule,
  ],
  providers: [
    ThemeableBrowser,
    AppVersion,
    SafeHtmlPipe,
    Network,
    // NetworkServiceProviderService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    StatusBar,
    SplashScreen,
    File,
    FileChooser,
    Base64,
    FileTransfer,
    FilePath,
    IOSFilePicker,
    InAppBrowser,
    OneSignal,
    HomeService,
    ConnectionService,
    UserService,
    LevelService,
    Market,
    { provide: LOCALE_ID, useValue: 'id-ID' }
    // { provide: HTTP_INTERCEPTORS, useClass: InterceptorProvider, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
