import { IModel } from '../../interfaces/model-base/IModel';

export interface ICertif extends IModel {
  certification_id: string;
  employee_id: string;
  certification_date: string;
  title: string;
  description: string;
  certification_file: string;
  created_at: string;
}