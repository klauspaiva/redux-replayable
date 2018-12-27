import { db as actionsMap } from './middleware';
import { Action } from './middleware/types';

export const middleware = (store: any) => (next: any) => (action: Action) => {
  console.group(action.type);
  console.info(actionsMap.get(store));
  actionsMap.set(store, action);
  console.info('dispatching action', action);
  let result = next(action);
  console.log('next state', store.getState());
  console.info(actionsMap.get(store));
  console.groupEnd();
  return result;
};

export default middleware;
