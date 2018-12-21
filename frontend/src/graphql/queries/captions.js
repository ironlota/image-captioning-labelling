import gql from 'graphql-tag';

export default gql`
  query captionEdit {
    currentUser {
      captionCuratedCount
      captionEmotionCount
      captionEditCount
      captions {
        captionEdit {
          caption_id
          text
        }
      }
    }
  }
`;
