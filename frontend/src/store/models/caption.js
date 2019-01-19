const caption = {
  state: {
    curatedCaption: {},
    editCaption: {},
    togglePanel: {},
  }, // initial state
  reducers: {
    /* eslint-disable camelcase, no-param-reassign */
    editCaption(state, { caption_id }, value) {
      state.editCaption[caption_id] = value;
      return state;
    },
    _curatedCaptionStep(state, image_id, step) {
      state.curatedCaption[image_id] = step;
      return state;
    },
    togglePanel(state, objId, value) {
      state.togglePanel[objId] = value;
      return state;
    },
  },
  effects: dispatch => ({
    async curatedCaptionStep({ image_id, step, callback = async () => {} }) {
      dispatch.caption._curatedCaptionStep(image_id, step);
      await callback();
    },
  }),
};

export default caption;
