import gql from 'graphql-tag';

export default gql`
  mutation createUser($input: createUserInput!) {
    createUser(createUserInput: $input) {
      firstName
      lastName
      email
      username
      createdAt
      updatedAt
    }
  }
`;
