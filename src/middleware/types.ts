import { Action } from '../types';

export interface CreateMiddlewareOptions {
  id?: any;
  actionFilterFunction: (action: Action) => boolean;
  gdprRetrievalFunction: () => Action[];
}
