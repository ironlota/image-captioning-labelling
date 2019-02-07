/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import ImageList from '@/components/ImageList';

import redirect from '@/utils/redirect';
import checkLoggedIn from '@/utils/checkLoggedIn';

@withStyles({
  root: {
    textAlign: 'center',
    // height: '100vh',
  },
})
class Images extends React.Component {
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
        <ImageList />
      </div>
    );
  }
}

export default Images;
