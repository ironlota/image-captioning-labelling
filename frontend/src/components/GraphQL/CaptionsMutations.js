import React from 'react';

import { Mutation } from 'react-apollo';

import { adopt } from 'react-adopt';

import {
  M_CURATE_CAPTION,
  M_EDIT_CAPTION,
  M_EMOTION_CAPTION,
  M_CHANGE_STEP_CAPTION,
} from '@/graphql/mutations';

export default adopt({
  curateCaption: ({ render }) => (
    <Mutation mutation={M_CURATE_CAPTION}>
      {(mutation, result) => render({ mutation, result })}
    </Mutation>
  ),
  editCaption: ({ render }) => (
    <Mutation mutation={M_EDIT_CAPTION}>
      {(mutation, result) => render({ mutation, result })}
    </Mutation>
  ),
  emotionCaption: ({ render }) => (
    <Mutation mutation={M_EMOTION_CAPTION}>
      {(mutation, result) => render({ mutation, result })}
    </Mutation>
  ),
  changeStepCaption: ({ render }) => (
    <Mutation mutation={M_CHANGE_STEP_CAPTION}>
      {(mutation, result) => render({ mutation, result })}
    </Mutation>
  ),
});
