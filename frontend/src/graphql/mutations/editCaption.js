import gql from 'graphql-tag';

export default gql`
  mutation editCaption($input: createEditCaption) {
    editCaption(createEditCaption: $input) {
      captionEdit {
        caption_id
        text
      }
    }
  }
`;
