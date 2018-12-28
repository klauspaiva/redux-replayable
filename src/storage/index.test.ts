import { db } from './index';

describe('Storage', () => {
    describe('init', () => {
        const key = 'init-key';

        test('should have defaults when init is called with an empty config', () => {
            db.init({
                id: key,
            });
            expect(db.get(key)).toEqual({
                actions: [],
            });
        });

        test('should store callback functions if provided', () => {
            const filterFn = () => true;
            const gdprFn = () => [];
            db.init({
                id: key,
                actionFilterFunction: filterFn,
                gdprRetrievalFunction: gdprFn,
            });
            expect(db.get(key)).toEqual({
                actions: [],
                actionFilterFunction: filterFn,
                gdprRetrievalFunction: gdprFn,
            });
        });
    });

    describe('add / get', () => {
        test('adding and retrieving in sequence', () => {
            const key = 'key';

            expect(db.get(key)).toEqual({
                actions: [],
            });

            const action1 = { type: 'ACTION1' };
            db.add(key, action1);
            expect(db.get(key)).toEqual({
                actions: [action1],
            });

            const action2 = { type: 'ACTION2' };
            db.add(key, action2);
            expect(db.get(key)).toEqual({
                actions: [action1, action2],
            });
        });

        test('adding and retrieving different keys', () => {
            const key1 = 'key1';
            const key2 = 'key2';
            const dummyAction = { type: 'DUMMY' };

            db.add(key1, dummyAction);
            expect(db.get(key1)).toEqual({
                actions: [dummyAction],
            });
            expect(db.get(key2)).toEqual({
                actions: [],
            });

            db.add(key2, dummyAction);
            expect(db.get(key1)).toEqual({
                actions: [dummyAction],
            });
            expect(db.get(key2)).toEqual({
                actions: [dummyAction],
            });
        });
    });
});
