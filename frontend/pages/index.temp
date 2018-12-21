/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import FrontImages from '@/components/FrontImages';

import redirect from '@/utils/redirect';
import checkLoggedIn from '@/utils/checkLoggedIn';

@withStyles({
  root: {
    textAlign: 'center',
    height: '100vh',
  },
})
class Index extends React.Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
  };

  static async getInitialProps(context) {
    const { loggedInUser } = await checkLoggedIn(
      context.apolloClient,
      context.store
    );

    if (!loggedInUser.username) {
      redirect(context, '/login');
    }

    return {};
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <FrontImages />
      </div>
    );
  }
}

export default Index;
