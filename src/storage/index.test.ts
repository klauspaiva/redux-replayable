import { db } from './index';

describe('Middleware logic', () => {
  test('Dummy test', () => {
    db.set('test', { type: 'DUMMY' });
    expect(db.get('test')).toHaveLength(1);
  });
});
