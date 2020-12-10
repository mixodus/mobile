import { IModel } from '../../interfaces/model-base/IModel';

export interface INews extends IModel {
  news_id: string;
  news_title: string;
  news_type_id: string;
  news_url: string;
  news_photo: string;
  news_type: string;
  news_colour: string;
  news_photo_url: string;
}
