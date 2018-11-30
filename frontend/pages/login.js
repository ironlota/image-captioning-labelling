import { Component } from 'react';

import { Mutation } from 'react-apollo';

import Grid from '@material-ui/core/Grid';

import LoginForm from '@/components/Form/Login';

import checkLoggedIn from '@/utils/checkLoggedIn';
import redirect from '@/utils/redirect';

import { M_LOGIN } from '@/graphql/mutations';

class Login extends Component {
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
          top: '-64px',
          position: 'relative',
        }}
      >
        <Mutation mutation={M_LOGIN}>
          {loginAction => <LoginForm action={loginAction} />}
        </Mutation>
      </Grid>
    );
  }
}

export default Login;
