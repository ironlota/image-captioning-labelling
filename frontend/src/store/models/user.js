// const initialState = {
//   expiresIn: 0,
//   accessToken: null,
// };

const user = {
  state: {}, // initial state
  reducers: {
    /* eslint-disable no-param-reassign */
    setUser(state, payload) {
      return { ...state, ...payload };
      // return state;
    },
    clearUser(state) {
      state = {};
      return state;
    },
  },
};

export default user;
