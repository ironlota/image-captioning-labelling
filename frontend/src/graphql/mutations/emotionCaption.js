import gql from 'graphql-tag';

export default gql`
  mutation emotionCaption($input: createEmotionCaption) {
    emotionCaption(createEmotionCaption: $input) {
      captionEditCount
      captionCuratedCount
      captionEmotionCount
      captions {
        step
        image_id
        obj_id
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
