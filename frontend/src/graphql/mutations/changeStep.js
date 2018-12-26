import gql from 'graphql-tag';

export default gql`
  mutation changeStep($objId: Int!, $status: String!) {
    changeStep(objId: $objId, status: $status) {
      captions {
        image_id
        obj_id
        step
      }
    }
  }
`;
