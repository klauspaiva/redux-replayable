import redact from 'rdct';
import db from '../storage';
import { REPLAYING_META_ATTRIBUTE } from '../constants';
import { Action } from '../types';

export default (key: any): Action[] => {
    const entry = db.get(key);

    return entry.actions.map(action => ({
        ...(entry.gdprFriendlyRetrieval ? redact(action) : action),
        type: action.type,
        meta: {
            ...action.meta,
            [REPLAYING_META_ATTRIBUTE]: true,
        },
    }));
};
