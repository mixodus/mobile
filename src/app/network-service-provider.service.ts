// import { Injectable } from '@angular/core';
// import { Platform } from '@ionic/angular';
// import { BehaviorSubject } from 'rxjs/Rx';
// import { ToastController } from '@ionic/angular';
// import { Plugins, NetworkStatus } from '@capacitor/core';
// import { PluginListenerHandle } from '@capacitor/core/dist/esm/web/network';
// const { Network } = Plugins
// import { HomePage } from './home/home.page';

// @Injectable({
//   providedIn: 'root'
// })
// export class NetworkServiceProviderService {
//   public ev: any;
//   public connected: Boolean;
//   public networkStatus: NetworkStatus;
//   networkListener: PluginListenerHandle;
//   public homePage: HomePage;
//   public message: string;
//   constructor(private toastCtrl: ToastController, private platform: Platform) {
//     this.setSubscriptions();
//    }
//    async ngOnInit(){
//     this.networkListener = Network.addListener('networkStatusChange',  status => {
//       console.log('network status changed', status);
//       this.networkStatus = status;
//     });
//    }

//   setSubscriptions(){
//     this.networkListener = Network.addListener('networkStatusChange',  status => {
//       console.log('network status changed', status);
//       this.networkStatus = status;

//       if(status.connected === true){
//         this.connected = true;
//       }else if(status.connected === false){
//         this.connected = false;
//       }

//       if(this.connected === true){
//         this.showAlert("Connection Established");
//       }else if(this.connected === false){
//         this.showAlert("No connection");
//       }
//     });
//   }

//   async showAlert(message){
//     let toast = await this.toastCtrl.create({
//       cssClass: "error",
//       message: message,
//       position: "bottom",
//       duration: 2000
//     });
//     toast.present();
//   }
// }

