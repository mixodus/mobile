import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HistoryService } from './history.service';

@Injectable()
export class ChallengeResolver implements Resolve<any> {
  constructor(private _historyService: HistoryService) {}

  resolve() {
    return this._historyService.getChallengeDataStore(true);
  }
}