import React from 'react';
import PropTypes from 'prop-types';

import Router from 'next/router';

import { connect } from 'react-redux';
import { ApolloConsumer } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import MenuIcon from '@material-ui/icons/Menu';

import setCookie from '@/utils/setCookie';
import redirect from '@/utils/redirect';

import Drawer from './Drawer';

@withStyles({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
    margin: '0 auto',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
})
@connect(
  state => ({
    user: state.user,
  }),
  ({ user: { setUser } }) => ({
    setUser: user => setUser(user),
  })
)
class MenuAppBar extends React.Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,

    user: PropTypes.shape({}).isRequired,
  };

  state = {
    auth: true,
    anchorEl: null,
    openDrawer: false,
  };

  toggleDrawer = open => () => {
    this.setState({
      openDrawer: open,
    });
  };

  control = () => {
    const { auth } = this.state;

    return (
      <Switch
        checked={auth}
        onChange={this.handleChange}
        aria-label="LoginSwitch"
      />
    );
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleChange = event => {
    this.setState({ auth: event.target.checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  logOut = apolloClient => () => {
    setCookie('token', '', { maxAge: -1 }); // Expire the cookie immediately

    // Force a reload of all the current queries now that the user is
    // logged in, so we don't accidentally leave any state around.
    apolloClient.cache.reset().then(() => {
      redirect({}, '/login');
    });
  };

  render() {
    const { classes, user } = this.props;
    const { anchorEl, openDrawer } = this.state;

    const open = Boolean(anchorEl);

    return (
      <ApolloConsumer>
        {apolloClient => (
          <div className={classes.root}>
            <AppBar position="static">
              <Toolbar>
                {!!user.username && (
                  <IconButton
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="Menu"
                    onClick={this.toggleDrawer(true)}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
                <Typography
                  variant="h6"
                  color="inherit"
                  className={classes.grow}
                >
                  MSCOCO Labelling
                </Typography>
                {!!user.username && (
                  <div>
                    <IconButton
                      aria-owns={open ? 'menu-appbar' : undefined}
                      aria-haspopup="true"
                      onClick={this.handleMenu}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      open={open}
                      onClose={this.handleClose}
                    >
                      <MenuItem onClick={() => Router.push('/account')}>
                        My account
                      </MenuItem>
                      <MenuItem onClick={this.logOut(apolloClient)}>
                        Sign Out
                      </MenuItem>
                    </Menu>
                  </div>
                )}
              </Toolbar>
            </AppBar>
            <Drawer open={openDrawer} toggleDrawer={this.toggleDrawer} />
          </div>
        )}
      </ApolloConsumer>
    );
  }
}

export default MenuAppBar;
