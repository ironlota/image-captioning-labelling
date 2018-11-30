import { Q_CURRENT_USER } from '@/graphql/queries';

export default (apolloClient, store) =>
  apolloClient
    .query({
      query: Q_CURRENT_USER,
    })
    .then(({ data: { currentUser } }) => {
      store.dispatch.user.setUser(currentUser);

      return { loggedInUser: currentUser };
    })
    .catch(() => {
      store.dispatch.user.clearUser();

      return { loggedInUser: {} };
    });
