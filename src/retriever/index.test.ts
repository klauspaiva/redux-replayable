import retriever from './index';
import { REPLAYABLE_META_ATTRIBUTE } from '../constants';
import { Action } from '../types';
import * as storage from '../storage';

const storageMock = {
    init: jest.fn(),
    add: jest.fn(),
    get: jest.fn(),
    clear: jest.fn(),
};

const simpleAction: Action = {
    type: 'SIMPLE_ACTION',
};
const complexAction: Action = {
    type: 'COMPLEX_ACTION',
    meta: {
        [REPLAYABLE_META_ATTRIBUTE]: true,
        analytics: new Object(),
    },
    user: 'panda@example.com',
};

describe('Retrieval of recorded actions', () => {
    const key = 'demo-key';
    beforeEach(() => {
        (storage as any).default = storageMock;
    });
    afterEach(() => {
        Object.keys(storageMock).forEach(key => (storageMock as any)[key].mockClear());
    });

    describe('GDPR-friendly', () => {
        test('redacts output when GDPR configuration is on', () => {
            storageMock.get.mockReturnValue({
                actions: [simpleAction, complexAction],
                gdprFriendlyRetrieval: true,
            });

            const actions = retriever(key);
            expect(actions).toEqual([
                simpleAction,
                {
                    ...complexAction,
                    user: 'p***************m',
                },
            ]);
        });
    });

    describe('non-GDPR-friendly', () => {
        test('returns unchanged actions when GDPR configuration is off', () => {
            storageMock.get.mockReturnValue({
                actions: [simpleAction, complexAction],
                gdprFriendlyRetrieval: false,
            });

            const actions = retriever(key);
            expect(actions).toEqual([simpleAction, complexAction]);
        });
    });
});
