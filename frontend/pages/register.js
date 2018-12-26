import { Component } from 'react';

import { Mutation } from 'react-apollo';

import Grid from '@material-ui/core/Grid';

import RegisterForm from '@/components/Form/Register';

import checkLoggedIn from '@/utils/checkLoggedIn';
import redirect from '@/utils/redirect';

import { M_REGISTER } from '@/graphql/mutations';

class Register extends Component {
  static async getInitialProps(context) {
    const { loggedInUser } = await checkLoggedIn(
      context.apolloClient,
      context.store
    );

    if (loggedInUser.username) {
      redirect(context, '/');
    }

    return {};
  }

  render() {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{
          margin: '0px',
          padding: '0px',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        <Mutation mutation={M_REGISTER}>
          {registerAction => <RegisterForm action={registerAction} />}
        </Mutation>
      </Grid>
    );
  }
}

export default Register;
