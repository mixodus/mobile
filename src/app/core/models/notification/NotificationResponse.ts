import { IResponse } from '../../interfaces/model-base/IResponse';
import { INotif } from './INotification';

export class NotificationResponse implements IResponse<INotif[]> {
  status = false;
  data: INotif[] = [];
  error = null;
  message = null;
  
}