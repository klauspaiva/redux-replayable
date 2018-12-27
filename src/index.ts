import actionsMap from './middleware';

export const middleware = (store: any) => (next: any) => (action: any) => {
  console.group(action.type);
  console.info(actionsMap.set(store, [action]));
  console.info('dispatching action', action);
  let result = next(action);
  console.log('next state', store.getState());
  console.info(actionsMap);
  console.groupEnd();
  return result;
};

export default middleware;
