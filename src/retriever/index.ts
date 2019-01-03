import redact from 'rdct';
import db from '../storage';
import { Action } from '../types';

export default (key: any): Action[] => {
    const entry = db.get(key);

    return entry.actions.map(action => {
        if (entry.gdprFriendlyRetrieval === false) {
            return action;
        }

        const redactedAction = {
            ...redact(action),
            type: action.type,
            meta: {
                ...action.meta,
            },
        };

        // just to avoid creating an entry for "meta" if original action didn't have it
        if (!action.meta) {
            delete redactedAction.meta;
        }
        return redactedAction;
    });
};
