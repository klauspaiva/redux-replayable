import createMiddleware from './middleware';
import { CreateMiddlewareOptions } from './middleware/types';
import {
    REPLAYABLE_META_ATTRIBUTE,
    REPLAYING_META_ATTRIBUTE,
    ACTION_TYPE_REPLAY,
    ACTION_TYPE_CLEAR,
} from './constants';
import { Action } from './types';

export {
    Action,
    CreateMiddlewareOptions,
    REPLAYABLE_META_ATTRIBUTE,
    REPLAYING_META_ATTRIBUTE,
    ACTION_TYPE_REPLAY,
    ACTION_TYPE_CLEAR,
};

export default createMiddleware;
