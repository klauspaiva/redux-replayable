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
            entry.actions.forEach(action => store.dispatch(action));
            return;
        } else if (action.type === ACTION_TYPE_CLEAR) {
            db.clear(key);
            return;
        }

        // should this action be stored?
        if (entry.actionFilterFunction(action) === true) {
            db.add(key, action);
        }

        return next(action);
    };
};
