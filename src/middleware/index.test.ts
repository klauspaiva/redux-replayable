import replayableMiddleware from './index';
import * as storage from '../storage';
import { REPLAYABLE_META_ATTRIBUTE } from '../constants';
import { Action } from '../types';

const store = jest.fn();
const next = jest.fn();
const testReplayableAction: Action = {
    type: 'REPLAYABLE',
    meta: {
        [REPLAYABLE_META_ATTRIBUTE]: true,
    },
};
const testGenericAction: Action = {
    type: 'GENERIC',
};

const storageMock = {
    init: jest.fn(),
    add: jest.fn(),
    get: jest.fn().mockReturnValue(storage.defaultEntry),
    clear: jest.fn(),
};

describe('Middleware', () => {
    beforeEach(() => {
        (storage as any).default = storageMock;
    });
    afterEach(() => {
        Object.keys(storageMock).forEach(key => (storageMock as any)[key].mockClear());
    });

    describe('initialisation logic', () => {
        test('uses store as identifier if one is not provided', () => {
            replayableMiddleware()(store)(next)(testReplayableAction);
            expect(storageMock.init).toHaveBeenNthCalledWith(1, {
                id: store,
            });
        });
        test('uses provided identifier instead of defaulting to store', () => {
            replayableMiddleware({
                id: 'my-custom-id',
            })(store)(next)(testReplayableAction);
            expect(storageMock.init).toHaveBeenNthCalledWith(1, {
                id: 'my-custom-id',
            });
        });
    });

    describe('actions not marked as replayable', () => {
        test('ignores actions that do not match filter function', () => {
            replayableMiddleware()(store)(next)(testGenericAction);
            expect(storageMock.add).toBeCalledTimes(0);
        });
    });

    describe('actions marked as replayable', () => {
        test('stores only actions that match filter function', () => {
            const middleware = replayableMiddleware()(store)(next);
            middleware(testReplayableAction);
            middleware(testGenericAction);

            expect(storageMock.add).toHaveBeenNthCalledWith(1, store, testReplayableAction);
        });
    });
});
