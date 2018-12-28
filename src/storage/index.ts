import pick from 'lodash/pick';
import { Action } from '../types';
import { CreateMiddlewareOptions } from '../middleware/types';
import { StorageEntry } from './types';

const defaultEntry: StorageEntry = {
    actions: [],
};

class DB {
    db: Map<any, StorageEntry>;
    constructor() {
        this.db = new Map();
    }
    init(key: any, config: CreateMiddlewareOptions) {
        this.db.set(key, {
            ...defaultEntry,
            ...pick(config, ['actionFilterFunction', 'gdprRetrievalFunction']),
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
}

const db = new DB();
// **temporarily** for testing
export { db };

export default undefined;
