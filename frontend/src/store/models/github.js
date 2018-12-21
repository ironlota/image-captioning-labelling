import fetch from 'isomorphic-unfetch';

const github = {
  state: {
    users: [],
    isLoading: false,
  }, // initial state
  reducers: {
    /* eslint-disable no-param-reassign */
    requestUsers(state) {
      return {
        users: [],
        isLoading: true,
      };
    },
    receiveUsers(state, payload) {
      state.users = payload;
      state.isLoading = false;

      return state;
    },
    /* eslint-enable no-param-reassign */
  },
  effects: {
    // handle state changes with impure functions.
    // use async/await for async actions
    async fetchUsers(payload, rootState) {
      try {
        this.requestUsers();
        const response = await fetch('https://api.github.com/users');
        const users = await response.json();
        this.receiveUsers(users);
      } catch (err) {
        this.receiveUsers([]);
      }
    },
  },
};

export default github;
