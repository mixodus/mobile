import { Injectable } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { DataStore } from '../../../shell/data-store';
import { CountryResponse } from '../../models/country/CountryResponse';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(
    private _http: HttpClient,
    private _globalService: GlobalService,
    private _auth: AuthenticationService
  ) {}

  private _countriesDataStore: DataStore<CountryResponse>;

  getCountries() {
    const headers = new HttpHeaders({
      'X-Api-Key': this._globalService.getGlobalApiKey(),
      'X-Token': `${this._auth.token}`
    });
    const options = { headers: headers };

    const countriesEventEndpoint =
      this._globalService.apiUrl +
      'api/event/countries';

    return this._http.get<CountryResponse>(countriesEventEndpoint, options);
  }

  getCountriesDataStore(refresh: boolean = false) {
    if (this._countriesDataStore == undefined || refresh) {
      this._countriesDataStore = new DataStore(new CountryResponse());
      this._countriesDataStore.load(this.getCountries());
    }

    return this._countriesDataStore;
  }
}
