import { IModel } from '../../interfaces/model-base/IModel';

export interface INotif extends IModel {
  notif_id: string;
  notif_type_id: string;
  notif_detail_id: string;
  title: string;
  user_id: string;
  description: string;
  long_description: string;
  created_at: string;
  modified_at: string;
  is_new: string;
  image_icon: string;
  date_past: string;
  date_convert: boolean;
}