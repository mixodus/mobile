import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../services/global.service';
import { AuthenticationService } from '../services/auth/authentication.service';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { DataStore } from '../shell/data-store';
import { ProductModel } from './product.model';

@Injectable()
export class RedeemPointsService {
    productsListDataStore: DataStore<ProductModel>;

    constructor(private http: HttpClient, private globalService: GlobalService, private storage: Storage, private auth: AuthenticationService) { }


    getProductsListDataSource(): Observable<ProductModel> {
        let token = this.auth.token;

        // let url = this.globalService.getApiUrl() + 'api/profile/friend/' + userId + '?X-Api-Key=' + this.globalService.getGlobalApiKey() + '&X-Token=' + token;
        let url = "";

        return this.http.get<ProductModel>(url);
        // return this.http.get<UserProfileModel>('./assets/sample-data/user/user-profile.json');

    }

    public getProductsListDataStore(dataSource: Observable<ProductModel>): DataStore<ProductModel> {
        // Use cache if available
        if (!this.productsListDataStore) {
            // Initialize the model specifying that it is a shell model
            const shellModel: ProductModel = new ProductModel();
            this.productsListDataStore = new DataStore(shellModel);
        }
        // Trigger the loading mechanism (with shell) in the dataStore
        this.productsListDataStore.load(dataSource);
        return this.productsListDataStore;
    }
}