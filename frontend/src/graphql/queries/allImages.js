import gql from 'graphql-tag';

export default gql`
  query getAllImages($skip: Int, $limit: Int, $search: String) {
    allImages(skip: $skip, limit: $limit, search: $search) {
      image_id
      height
      width
      captions {
        id
        en
        caption_id
      }
      coco_url
      date_captured
    }
    currentUser {
      captionEditCount
      captionEdit {
        caption_id
        text
      }
    }
    _allImagesMeta {
      count
    }
  }
`;
