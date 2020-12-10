import { IModel } from '../../interfaces/model-base/IModel';

export interface ICountry extends IModel {
  country_id: string;
  country_code: string;
  country_name: string;
  country_flag: string;
}
