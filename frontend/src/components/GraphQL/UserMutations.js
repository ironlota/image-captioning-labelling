import React from 'react';

import { Mutation } from 'react-apollo';

import { adopt } from 'react-adopt';

import { M_CHANGE_PASSWORD, M_CHANGE_RANGE } from '@/graphql/mutations';

export default adopt({
  changePassword: ({ render }) => (
    <Mutation mutation={M_CHANGE_PASSWORD}>
      {(mutation, result) => render({ mutation, result })}
    </Mutation>
  ),
  changeRange: ({ render }) => (
    <Mutation mutation={M_CHANGE_RANGE}>
      {(mutation, result) => render({ mutation, result })}
    </Mutation>
  ),
  // getImages: ({ render }) => (
  //   <Query query={Q_GET_IMAGES}>
  //     {(query, result) => render({ query, result })}
  //   </Query>
  // ),
});
