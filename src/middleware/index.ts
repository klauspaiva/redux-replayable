import { Action } from './types';

class CustomMap<K, V> extends Map {
  set(key: K, action: V) {
    const currentValue = super.get(key);
    if (Array.isArray(currentValue)) {
      super.set(key, currentValue.concat([action]));
    } else {
      super.set(key, [action]);
    }
    return this;
  }
  get(key: K) {
    const currentValue = super.get(key);
    if (Array.isArray(currentValue)) {
      return currentValue;
    } else {
      return [];
    }
  }
}

const actionsMap = new CustomMap<any, Action[]>();

export default actionsMap;
