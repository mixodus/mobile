import { IEvent, IChallenge } from '../../../core/models/event/IEvent';
import { IResponse } from '../../../core/interfaces/model-base/IResponse';

export class EventHistoryResponse implements IResponse<IEvent[]> {
    status = false;
    data: IEvent[] = [];
    error = null;
    message = null;
}

export class ChallengeHistoryResponse implements IResponse<IChallenge[]> {
    status = false;
    data: IChallenge[] = [];
    error = null;
    message = null;
}