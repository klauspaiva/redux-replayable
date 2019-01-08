# redux-replayable ⏮⏭

<p align="center">
    <a href="https://travis-ci.org/klauspaiva/redux-replayable">
        <img src="https://img.shields.io/travis/klauspaiva/redux-replayable.svg">
    </a>
    <a href="https://github.com/klauspaiva/redux-replayable">
        <img src="https://img.shields.io/github/license/klauspaiva/redux-replayable.svg">
    </a>
    <a href="https://github.com/klauspaiva/redux-replayable">
        <img src="https://img.shields.io/github/last-commit/klauspaiva/redux-replayable.svg">
    </a>
    <a href="https://www.npmjs.com/package/redux-replayable">
        <img src="https://img.shields.io/npm/dt/redux-replayable.svg">
    </a>
    <a href="https://www.npmjs.com/package/redux-replayable">
        <img src="https://img.shields.io/npm/v/redux-replayable.svg">
    </a>
</p>

A small Redux utility to collect actions for replaying and logging, with built-in whitelisting and GDPR-friendly controls.

## Getting started

Assuming you already have your Redux app up and running, you just need to find where you instantiate your `store` and supply the middleware provided by this module.

The minimal configuration would be:

```js
import replayableMiddleware from 'redux-replayable';

const store = createStore(reducer, preloadedState, applyMiddleware(replayableMiddleware()));
```

> **Pro-tip**: note that `replayableMiddleware()` is a function call, as you can provide a configuration object to customise its behaviour (detailed below).

With the default configuration, actions that match the following `action.meta` structure will be stored:

```js
import { REPLAYABLE_META_ATTRIBUTE } from 'redux-replayable';

{
    ...yourAction,
    meta: {
        ...yourAction.meta,
        // with the default configuration, the presence of this key with the value `true` is the marker for an action to be stored
        [REPLAYABLE_META_ATTRIBUTE]: true,
    }
}
```

Now that the set up is done, there are two options to replay actions: a simpler one and another more flexible.

### Extra meta properties

**For convenience**, actions are stored and then emitted with two additional properties to `action.meta`, so your app might decide to do something slightly different when a certain action is replayed.

```js
import { REPLAYING_META_ATTRIBUTE, DISPATCHED_AT_META_ATTRIBUTE } from 'redux-replayable';

{
    ...originalAction,
    meta: {
        ...originalAction.meta,
        [DISPATCHED_AT_META_ATTRIBUTE]: Date.now(), // of when the action was originally dispatched
        [REPLAYING_META_ATTRIBUTE]: true, // added for convenience to all replayed actions
    }
}
```

> **Pro-tip**: under normal circumstances your app's reducers should probably just do the same thing regardless.

### Replaying actions: approach #1

The simple approach consists of emitting a specific action recognised by this module, which then will cause the respective actions to be replayed in the exact order they originally happened (without any delay between them).

```js
import { ACTION_TYPE_REPLAY } from 'redux-replayable';

// ...

store.dispatch({
    type: ACTION_TYPE_REPLAY,
});
```

**Note**: replaying actions using this method does not take into consideration the GDPR flag as there is no way for your app to mishandle user information other than what it already does.

It is also possible to clear the list of actions at will by emitting the following action: `ACTION_TYPE_CLEAR`.

### Replaying actions: approach #2

This approach is more flexible as it gives you raw access to the list of actions, **but adhering to the initial configuration of GDPR-friendliness**.

It is done as follows:

```js
import { retrieveReplayableActions } from 'redux-replayable';

// ...

const listOfActions = retrieveReplayableActions(store);
// or instead of `store`, the id you originally provided upon middleware creation
```

If the GDPR-friendly flag is on, the `action` objects are redacted using the [rdct](https://github.com/whiskeredwonder/rdct) library.

> **Pro-tip**: properties `type` and `meta` are untouched as they should never be used to hold user information.

## Runtime configuration

The following configuration object can be provided when the middleware is created:

```js
export interface CreateMiddlewareOptions {
    id?: any;
    actionFilterFunction?: (action: Action) => boolean;
    gdprFriendlyRetrieval?: boolean;
}
```

| Property                | Default                                                                     | Explanation                                                                                                                                                                                                    |
| ----------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                    | `store` instance                                                            | Any value or object used as "key" to store actions emitted against.                                                                                                                                            |
| `actionFilterFunction`  | `action => action.meta && action.meta.[REPLAYABLE_META_ATTRIBUTE] === true` | A function that receives every action and should return `true` for actions that can be replayed (so stored), `false` otherwise.                                                                                |
| `gdprFriendlyRetrieval` | `true`                                                                      | Whether actions retrieved in bulk (via call to `retrieveReplayableActions`) have potentially sensitive values automatically redacted.<br>Actions replayed by emitting `ACTION_TYPE_REPLAY` are never redacted. |

## Local development

Simply use `yarn link` and `yarn link redux-replayable` for an optimal dev loop.

## Running tests

`yarn test` is your friend. :)
