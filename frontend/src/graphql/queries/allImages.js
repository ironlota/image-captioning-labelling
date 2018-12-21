import gql from 'graphql-tag';

export default gql`
  query getAllImages($skip: Int, $limit: Int, $search: String) {
    allImages(skip: $skip, limit: $limit, search: $search) {
      obj_id
      image_id
      height
      width
      need_emotion
      captions {
        id
        en
        caption_id
      }
      url
    }
    currentUser {
      captions {
        image_id
        obj_id
        curatedCaptions
        captionEdit {
          caption_id
          text
        }
        captionEmotion {
          sad
          happy
          angry
        }
      }
      captionEditCount
      captionCuratedCount
      captionEmotionCount
    }
    _allImagesMeta {
      count
    }
  }
`;
