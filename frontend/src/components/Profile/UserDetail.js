import { Component } from 'react';
import PropTypes from 'prop-types';

import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import PersonOutlined from '@material-ui/icons/PersonOutlined';
import EditIcon from '@material-ui/icons/Edit';

import purple from '@material-ui/core/colors/purple';

import { M_CHANGE_PASSWORD } from '@/graphql/mutations';

import EditPassword from '@/components/Form/EditPassword';

@withStyles(theme => ({
  avatar: {
    width: 60,
    height: 60,
    backgroundColor: purple[500],
    justifySelf: 'center',
  },
  card: {
    minWidth: 345,
    padding: '20px',
  },
  center: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  gridForm: {
    margin: '0 auto',
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
  },
  '@media (max-width: 786px)': {
    card: {
      padding: '0 0 60px 20px',
      '-webkit-box-shadow': 'none',
      '-moz-box-shadow': 'none',
      'box-shadow': 'none',
    },
  },
}))
@connect(state => ({
  user: state.user,
}))
class UserDetail extends Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,

    user: PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      lastLogin: PropTypes.string,
      captionEditCount: PropTypes.number,
    }),
  };

  static defaultProps = {
    user: {},
  };

  state = {
    openEditPassword: false,
  };

  handleEditPassword = open => {
    this.setState({
      openEditPassword: open,
    });
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  avatarComponent = () => {
    const { classes } = this.props;

    return (
      <Avatar aria-label="Recipe" className={classes.avatar}>
        R
      </Avatar>
    );
  };

  render() {
    const { classes, user } = this.props;
    const { openEditPassword } = this.state;

    return (
      <Mutation mutation={M_CHANGE_PASSWORD}>
        {editPasswordAction => (
          <Grid item xs={12} md={12} className={classes.gridForm}>
            <EditPassword
              action={editPasswordAction}
              open={openEditPassword}
              toggleDialog={this.handleEditPassword}
            />
            <Card className={classes.card}>
              <CardContent>
                <CardActions className={classes.center}>
                  <Avatar className={classes.avatar}>
                    <PersonOutlined />
                  </Avatar>
                </CardActions>
                <List>
                  <ListItem>
                    <ListItemText
                      className={classes.textCenter}
                      primary={`${user.firstName} ${user.lastName}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      className={classes.textCenter}
                      primary="Caption Edit Count : "
                    />
                    <ListItemText primary={user.captionEditCount} />
                  </ListItem>
                  <ListItem
                    button
                    onClick={() => this.handleEditPassword(true)}
                  >
                    <ListItemText primary="Edit Password" />
                    <ListItemIcon>
                      <EditIcon />
                    </ListItemIcon>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Mutation>
    );
  }
}

export default UserDetail;
