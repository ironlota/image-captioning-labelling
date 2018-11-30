import gql from 'graphql-tag';

export default gql`
  mutation login($input: createUserLogin!) {
    login(createUserLogin: $input) {
      expiresIn
      accessToken
    }
  }
`;
