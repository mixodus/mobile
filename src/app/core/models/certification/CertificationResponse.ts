import { ICertif } from './ICertification';
import { IResponse } from '../../interfaces/model-base/IResponse';

export class CertificationResponse implements IResponse<ICertif[]> {
  status = false;
  data: ICertif[] = [];
  error = null;
  message = null;
  
}