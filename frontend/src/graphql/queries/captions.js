import gql from 'graphql-tag';

export default gql`
  query captionEdit {
    currentUser {
      captionEditCount
      captionEdit {
        caption_id
        text
      }
    }
  }
`;
