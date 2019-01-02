import replayableMiddleware from './index';
import * as storage from '../storage';
import {
    REPLAYABLE_META_ATTRIBUTE,
    REPLAYING_META_ATTRIBUTE,
    ACTION_TYPE_REPLAY,
    ACTION_TYPE_CLEAR,
} from '../constants';
import { Action } from '../types';

const store = {
    dispatch: jest.fn(),
};
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
        store.dispatch.mockClear();
        next.mockClear();
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
            expect(storageMock.add).not.toBeCalled();
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

    describe('replaying actions', () => {
        it('dispatches recorded actions when specific action is emitted', () => {
            storageMock.get.mockReturnValue({
                ...storage.defaultEntry,
                actions: [testReplayableAction],
            });
            replayableMiddleware()(store)(next)({ type: ACTION_TYPE_REPLAY });

            expect(next).not.toBeCalled();
            expect(store.dispatch).toBeCalledTimes(1);
            expect(store.dispatch).toHaveBeenNthCalledWith(1, {
                ...testReplayableAction,
                meta: {
                    ...testReplayableAction.meta,
                    [REPLAYING_META_ATTRIBUTE]: true,
                },
            });
        });
    });

    it('clears list of actions when specific action is emitted', () => {
        replayableMiddleware()(store)(next)({ type: ACTION_TYPE_CLEAR });
        expect(next).not.toBeCalled();
        expect(storageMock.clear).toBeCalledTimes(1);
    });
});
