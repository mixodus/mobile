import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataStore } from '../shell/data-store';
// import { TravelListingModel } from './listing/travel-listing.model';
import { EventDetailsModel } from './details/event-details.model';

@Injectable()
export class EventsService {
  // private listingDataStore: DataStore<TravelListingModel>;
  private detailsDataStore: DataStore<EventDetailsModel>;

  constructor(private http: HttpClient) { }

  // public getListingDataSource(): Observable<TravelListingModel> {
  //   return this.http.get<TravelListingModel>('./assets/sample-data/travel/listing.json');
  // }

  // public getListingStore(dataSource: Observable<TravelListingModel>): DataStore<TravelListingModel> {
  //   // Use cache if available
  //   if (!this.listingDataStore) {
  //     // Initialize the model specifying that it is a shell model
  //     const shellModel: TravelListingModel = new TravelListingModel();
  //     this.listingDataStore = new DataStore(shellModel);
  //     // Trigger the loading mechanism (with shell) in the dataStore
  //     this.listingDataStore.load(dataSource);
  //   }
  //   return this.listingDataStore;
  // }

  public getDetailsDataSource(): Observable<EventDetailsModel> {
    return this.http.get<EventDetailsModel>('./assets/sample-data/travel/details.json');
  }

  public getDetailsStore(dataSource: Observable<EventDetailsModel>): DataStore<EventDetailsModel> {
    // Use cache if available
    if (!this.detailsDataStore) {
      // Initialize the model specifying that it is a shell model
      const shellModel: EventDetailsModel = new EventDetailsModel();
      this.detailsDataStore = new DataStore(shellModel);
      // Trigger the loading mechanism (with shell) in the dataStore
      this.detailsDataStore.load(dataSource);
    }
    return this.detailsDataStore;
  }

}
