import db, { defaultEntry } from './index';

const actionFilterSpy = jest.fn();
defaultEntry.actionFilterFunction = actionFilterSpy;

describe('Storage', () => {
    describe('init', () => {
        const key = 'init-key';

        test('should have defaults when init is called with an empty config', () => {
            db.init({
                id: key,
            });
            expect(db.get(key)).toEqual({
                actions: [],
                actionFilterFunction: actionFilterSpy,
                gdprFriendlyOutput: true,
            });
        });

        test('should store callback functions if provided', () => {
            const filterFn = () => true;
            db.init({
                id: key,
                actionFilterFunction: filterFn,
                gdprFriendlyOutput: false,
            });
            expect(db.get(key)).toEqual({
                actions: [],
                actionFilterFunction: filterFn,
                gdprFriendlyOutput: false,
            });
        });
    });

    describe('add / get', () => {
        test('adding and retrieving in sequence', () => {
            const key = 'key';

            expect(db.get(key).actions).toEqual([]);

            const action1 = { type: 'ACTION1' };
            db.add(key, action1);
            expect(db.get(key).actions).toEqual([action1]);

            const action2 = { type: 'ACTION2' };
            db.add(key, action2);
            expect(db.get(key).actions).toEqual([action1, action2]);
        });

        test('adding and retrieving different keys', () => {
            const key1 = 'key1';
            const key2 = 'key2';
            const dummyAction = { type: 'DUMMY' };

            db.add(key1, dummyAction);
            expect(db.get(key1).actions).toEqual([dummyAction]);
            expect(db.get(key2).actions).toEqual([]);

            db.add(key2, dummyAction);
            expect(db.get(key1).actions).toEqual([dummyAction]);
            expect(db.get(key2).actions).toEqual([dummyAction]);
        });
    });

    describe('clear', () => {
        it('resets list of actions while preserving other configuration values', () => {
            const key = 'clear-key';
            const filterFn = () => true;
            const dummyAction = { type: 'DUMMY' };

            db.init({
                id: key,
                actionFilterFunction: filterFn,
                gdprFriendlyOutput: false,
            });
            db.add(key, dummyAction);
            expect(db.get(key).actions).toEqual([dummyAction]);

            db.clear(key);
            expect(db.get(key)).toEqual({
                actions: [],
                actionFilterFunction: filterFn,
                gdprFriendlyOutput: false,
            });
        });
    });
});
