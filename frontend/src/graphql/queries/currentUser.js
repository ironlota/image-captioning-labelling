import gql from 'graphql-tag';

export default gql`
  query currentUser {
    currentUser {
      username
      email
      firstName
      lastName
      lastLogin
      captionEditCount
      captionCuratedCount
      captionEmotionCount
    }
  }
`;
