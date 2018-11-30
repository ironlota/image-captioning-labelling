import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import PersonPinIcon from '@material-ui/icons/PersonPin';
import SpeakerNotesIcon from '@material-ui/icons/SpeakerNotes';

import Captions from './Captions';
import UserDetail from './UserDetail';

@withStyles(theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
}))
@connect(state => ({
  user: state.user,
}))
class Profile extends React.Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,

    user: PropTypes.shape({}).isRequired,
  };

  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  tabLabelCaption = () => {
    const { user, classes } = this.props;

    return (
      <Badge
        className={classes.padding}
        color="secondary"
        badgeContent={user.captionEditCount || 0}
      >
        Captions
      </Badge>
    );
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <AppBar position="fixed" color="default" className={classes.appBar}>
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
            fullWidth
          >
            <Tab label="Details" icon={<PersonPinIcon />} />
            <Tab label={this.tabLabelCaption()} icon={<SpeakerNotesIcon />} />
          </Tabs>
        </AppBar>
        {value === 0 && (
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
              position: 'sticky',
            }}
          >
            <UserDetail />
          </Grid>
        )}
        {value === 1 && <Captions />}
      </div>
    );
  }
}

export default Profile;
