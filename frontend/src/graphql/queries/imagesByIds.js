import gql from 'graphql-tag';

export default gql`
  query findImgUrlsByIds($ids: [ID!]) {
    findImgUrlsByIds(ids: $ids) {
      image_id
      url
      captions {
        caption_id
        id
        en
      }
    }
  }
`;
