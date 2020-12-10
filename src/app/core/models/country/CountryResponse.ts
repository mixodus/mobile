import { IResponse } from '../../interfaces/model-base/IResponse';
import { ICountry } from './ICountry';

export class CountryResponse implements IResponse<ICountry[]> {
  status = false;
  message = null;
  error = null;
  data: ICountry[] = [];
}
