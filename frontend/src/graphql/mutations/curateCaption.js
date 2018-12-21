import gql from 'graphql-tag';

export default gql`
  mutation curateCaption($input: createCurateCaption) {
    curateCaption(createCurateCaption: $input) {
      captionEditCount
      captionCuratedCount
      captionEmotionCount
      captions {
        obj_id
        image_id
        step
        curatedCaptions
        captionEdit {
          caption_id
          text
        }
        captionEmotion {
          happy
          sad
          angry
        }
      }
    }
  }
`;
