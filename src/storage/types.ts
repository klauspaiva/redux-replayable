import { Action } from '../types';
import { CreateMiddlewareOptions } from '../middleware/types';

export interface StorageEntry {
    actions: Action[];
    actionFilterFunction: (action: Action) => boolean;
    gdprFriendlyOutput: boolean;
}

export interface StorageDB {
    init(config: CreateMiddlewareOptions): void;
    add(key: any, action: Action): StorageDB;
    get(key: any): StorageEntry;
    clear(key: any): void;
}
