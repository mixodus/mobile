import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MapperService {
  constructor() {}

  mapImageUrl(directory: string) {
    const imageEndpoint = environment.imageEndpoint;

    return imageEndpoint + directory;
  }
}
