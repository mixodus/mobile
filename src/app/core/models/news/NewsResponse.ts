import { IResponse } from '../../interfaces/model-base/IResponse';
import { INews } from './INews';

export class NewsResponse implements IResponse<INews[]> {
  status = false;
  message = null;
  data = [];
  error = null;
}

export interface NewsDetail {
  status: boolean;
  message: string;
  data: NewsDetailData;
  error: string | null;
  isShell: boolean;
}

export interface NewsDetailData {
  newsPhoto: string;
  newsType: string;
  newsTitle: string;
  newsDetail: string;
  newsDate: string;
}
