const initialState = {
  openSnackbar: false,
  messageSnackbar: '',
  snackbarType: 'success',
};

const message = {
  state: initialState, // initial state
  reducers: {
    /* eslint-disable no-param-reassign */
    _setMessage(state, payload) {
      state.messageSnackbar = payload.message;
      state.snackbarType = payload.messageType;
    },
    openMessage(state) {
      state.openSnackbar = true;
    },
    clearMessage(state) {
      state = initialState;
      return state;
    },
  },
  effects: dispatch => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async setMessage({
      message: _message,
      messageType = 'success',
      timeout = 1000,
      callback = () => {},
    }) {
      dispatch.message._setMessage({ message: _message, messageType });
      dispatch.message.openMessage();
      await new Promise(resolve => setTimeout(resolve, timeout));
      dispatch.message.clearMessage();
      await new Promise(resolve => setTimeout(resolve, 100));
      callback();
    },
  }),
};

export default message;
