import { Action } from '/types';

class ActionsDB<K, V> {
  db: Map<K, V[]>;
  constructor() {
    this.db = new Map();
  }
  set(key: K, action: V) {
    const currentValue = this.db.get(key) || [];
    this.db.set(key, currentValue.concat([action]));
    return this;
  }
  get(key: K) {
    return this.db.get(key) || [];
  }
}

const db = new ActionsDB<any, Action>();
// **temporarily** for testing
export { db };

export default undefined;
