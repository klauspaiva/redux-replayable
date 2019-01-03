import pick from 'lodash/pick';
import { REPLAYABLE_META_ATTRIBUTE } from '../constants';
import { Action } from '../types';
import { CreateMiddlewareOptions } from '../middleware/types';
import { StorageEntry, StorageDB } from './types';

const defaultActionFilterFunction = (action: Action) => action.meta && action.meta[REPLAYABLE_META_ATTRIBUTE] === true;

export const defaultEntry: StorageEntry = {
    actions: [],
    actionFilterFunction: defaultActionFilterFunction,
    gdprFriendlyRetrieval: true,
};

class DB implements StorageDB {
    db: Map<any, StorageEntry>;
    constructor() {
        this.db = new Map();
    }
    init(config: CreateMiddlewareOptions): void {
        this.db.set(config.id, {
            ...defaultEntry,
            ...pick(config, ['actionFilterFunction', 'gdprFriendlyRetrieval']),
        });
    }
    add(key: any, action: Action) {
        const currentValue = this.get(key);
        this.db.set(key, {
            ...currentValue,
            actions: currentValue.actions.concat([action]),
        });
        return this;
    }
    get(key: any): StorageEntry {
        return this.db.get(key) || defaultEntry;
    }
    clear(key: any): void {
        const currentValue = this.get(key);
        this.db.set(key, {
            ...currentValue,
            actions: [],
        });
    }
}

export default new DB();
