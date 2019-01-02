import db from '../storage';
import { Action } from '../types';
import { ACTION_TYPE_REPLAY, ACTION_TYPE_CLEAR } from '../constants';
import { CreateMiddlewareOptions } from './types';

export default (config: CreateMiddlewareOptions = {}) => (store: any) => {
    const key = config.id || store;
    db.init({
        ...config,
        id: key,
    });
    return (next: any) => (action: Action) => {
        const entry = db.get(key);

        if (action.type === ACTION_TYPE_REPLAY) {
            console.group(ACTION_TYPE_REPLAY);
            console.info('Replaying stored actions...');
            console.groupEnd();
            return;
        } else if (action.type === ACTION_TYPE_CLEAR) {
            console.group(ACTION_TYPE_CLEAR);
            console.info('Resetting stored actions...');
            db.clear(key);
            console.groupEnd();
            return;
        }

        // if the action cannot be identified as replayable, just move on
        if (entry.actionFilterFunction(action) !== true) {
            console.group(action.type);
            console.info(`Skipped...`);
            console.groupEnd();
            return next(action);
        }

        console.group(action.type);
        console.info(entry);
        db.add(key, action);
        console.info('dispatching action', action);
        let result = next(action);
        console.log('next state', store.getState());
        console.info(db.get(key));
        console.groupEnd();
        return result;
    };
};
