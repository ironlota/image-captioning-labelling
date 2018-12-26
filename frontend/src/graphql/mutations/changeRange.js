import gql from 'graphql-tag';

export default gql`
  mutation changeRange($range: String!) {
    changeRange(range: $range) {
      range
    }
  }
`;
