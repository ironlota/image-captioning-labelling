import { init } from '@rematch/core';
import immerPlugin from '@rematch/immer';

import { createLogger } from 'redux-logger';

import { user, caption, message } from './models';

export const initStore = (isServer, initialState, plugins = []) => {
  const immer = immerPlugin();

  const middlewares = [];

  if (!isServer && process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger());
  }

  return init({
    models: {
      user,
      caption,
      message,
    },
    plugins: [immer, ...plugins],
    redux: {
      initialState,
      middlewares,
      rootReducers: {
        RESET: () => undefined,
      },
    },
  });
};

export const makeStore = (_initialState, { isServer }) =>
  initStore(isServer, _initialState);
