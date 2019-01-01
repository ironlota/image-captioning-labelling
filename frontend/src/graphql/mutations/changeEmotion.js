import gql from 'graphql-tag';

export default gql`
  mutation changeEmotion($emotion: String!) {
    changeEmotion(emotion: $emotion) {
      selectedEmotion
    }
  }
`;
