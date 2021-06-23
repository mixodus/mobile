import { ShellModel } from '../shell/data-store';

export interface Topics {
  topic_id: number;
  name: string;
  title: string;
  banner: string;
  banner_url: string;  
}

export class TopicModel extends ShellModel {
  status: boolean;
  message: string;
  data: Topics[];

  constructor() {
    super();
  }
}
