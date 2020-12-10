import { Subject } from 'rxjs';

export interface ISubscriber {
  // a subject to destroy subscription in a component
  destroySubscription: Subject<any>;

  // sending state flag
  isSending?: boolean;

  // loading state flag
  isLoading?: boolean;
}
