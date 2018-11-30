const caption = {
  state: {}, // initial state
  reducers: {
    /* eslint-disable camelcase, no-param-reassign */
    editCaption(state, { caption_id }, value) {
      state[caption_id] = value;
      return state;
    },
  },
};

export default caption;
