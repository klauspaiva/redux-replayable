import { Action } from '../types';

export interface StorageEntry {
    actions: Action[];
    actionFilterFunction: (action: Action) => boolean;
    gdprRetrievalFunction?: () => Action[];
}
