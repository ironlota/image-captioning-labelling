import React from 'react';
import PropTypes from 'prop-types';

import Router from 'next/router';

import { withStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { K_MAIN, K_SETTING } from '@/constants';

@withStyles({
  list: {
    width: 250,
  },
})
class MainDrawer extends React.Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,

    open: PropTypes.bool.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
  };

  sideList = () => {
    const { classes } = this.props;

    return (
      <div className={classes.list}>
        <List>
          {K_MAIN.map(({ name, label, icon: Icon }) => (
            <ListItem key={name} button onClick={() => Router.push(name)}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {K_SETTING.map(({ name, label, icon: Icon }) => (
            <ListItem key={name} button onClick={() => Router.push(name)}>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  };

  render() {
    const { open, toggleDrawer } = this.props;

    return (
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <div
          tabIndex={0}
          role="button"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {this.sideList()}
        </div>
      </Drawer>
    );
  }
}

export default MainDrawer;
