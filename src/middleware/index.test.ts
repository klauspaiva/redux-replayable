import replayableMiddleware from './index';
import * as storage from '../storage';
import { Action } from '../types';

const store = jest.fn();
const next = jest.fn();
let testAction: Action = {
    type: 'DUMMY',
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
            replayableMiddleware()(store)(next)(testAction);
            expect(storageMock.init).toHaveBeenNthCalledWith(1, {
                id: store,
            });
        });
        test('uses provided identifier instead of defaulting to store', () => {
            replayableMiddleware({
                id: 'my-custom-id',
            })(store)(next)(testAction);
            expect(storageMock.init).toHaveBeenNthCalledWith(1, {
                id: 'my-custom-id',
            });
        });
    });
});
