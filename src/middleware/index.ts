import { db } from '../storage';
import { Action } from '../types';
import { CreateMiddlewareOptions } from './types';

export default (config: CreateMiddlewareOptions = {}) => (store: any) => {
    const key = config.id || store;
    db.init({
        ...config,
        id: key,
    });
    return (next: any) => (action: Action) => {
        console.group(action.type);
        console.info(db.get(key));
        db.add(key, action);
        console.info('dispatching action', action);
        let result = next(action);
        console.log('next state', store.getState());
        console.info(db.get(key));
        console.groupEnd();
        return result;
    };
};
