import { Component } from 'react';
import PropTypes from 'prop-types';

import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import PersonOutlined from '@material-ui/icons/PersonOutlined';
import EditIcon from '@material-ui/icons/Edit';

import purple from '@material-ui/core/colors/purple';

// import { M_CHANGE_PASSWORD } from '@/graphql/mutations';
import UserMutations from '@/components/GraphQL/UserMutations';

import EditPassword from '@/components/Form/EditPassword';
import EditRange from '@/components/Form/EditRange';
import EditEmotion from '@/components/Form/EditEmotion';

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
  itemLabel: {
    paddingRight: '40px',
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`,
  },
  paddingListItemText: {
    padding: '12px 0',
  },
  noMargin: {
    margin: 0,
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
      captionCuratedCount: PropTypes.number,
      captionEmotionCount: PropTypes.number,
    }),
  };

  static defaultProps = {
    user: {},
  };

  state = {
    openEditPassword: false,
    openEditRange: false,
    openEditEmotion: false,
  };

  handleDialog = state => open => {
    this.setState({
      [state]: open,
    });
  };

  render() {
    const { classes, user } = this.props;
    const { openEditPassword, openEditRange, openEditEmotion } = this.state;

    return (
      <UserMutations>
        {({ changePassword, changeRange, changeEmotion }) => (
          <Grid item xs={12} md={12} className={classes.gridForm}>
            <EditPassword
              action={changePassword.mutation}
              open={openEditPassword}
              toggleDialog={this.handleDialog('openEditPassword')}
            />
            <EditRange
              action={changeRange.mutation}
              open={openEditRange}
              toggleDialog={this.handleDialog('openEditRange')}
            />
            <EditEmotion
              action={changeEmotion.mutation}
              open={openEditEmotion}
              toggleDialog={this.handleDialog('openEditEmotion')}
            />
            <Card className={classes.card}>
              <CardContent>
                <CardActions className={classes.center}>
                  <Avatar className={classes.avatar}>
                    <PersonOutlined />
                  </Avatar>
                </CardActions>
                <List>
                  <ListItem className={classes.paddingListItemText}>
                    <ListItemText
                      className={classes.textCenter}
                      primary={`${user.firstName} ${user.lastName}`}
                    />
                  </ListItem>

                  <ListItem
                    className={classes.paddingListItemText}
                    button
                    onClick={() => this.handleDialog('openEditPassword')(true)}
                  >
                    <ListItemText
                      className={classes.itemLabel}
                      primary="Edit Password"
                    />
                    <ListItemSecondaryAction>
                      <ListItemIcon className={classes.noMargin}>
                        <EditIcon />
                      </ListItemIcon>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem
                    className={classes.paddingListItemText}
                    button
                    onClick={() => this.handleDialog('openEditRange')(true)}
                  >
                    <ListItemText
                      primary={`Image Edit Range (${user.range})`}
                      className={classes.itemLabel}
                    />
                    <ListItemSecondaryAction>
                      <ListItemIcon className={classes.noMargin}>
                        <EditIcon />
                      </ListItemIcon>
                    </ListItemSecondaryAction>
                    {/* <ListItemText primary={user.captionEditCount} /> */}
                  </ListItem>
                  <ListItem
                    className={classes.paddingListItemText}
                    button
                    onClick={() => this.handleDialog('openEditEmotion')(true)}
                  >
                    <ListItemText
                      primary={`Selected Emotion (${user.selectedEmotion})`}
                      className={classes.itemLabel}
                    />
                    <ListItemSecondaryAction>
                      <ListItemIcon className={classes.noMargin}>
                        <EditIcon />
                      </ListItemIcon>
                    </ListItemSecondaryAction>
                    {/* <ListItemText primary={user.captionEditCount} /> */}
                  </ListItem>
                  <ListItem className={classes.paddingListItemText}>
                    <ListItemText
                      className={classes.itemLabel}
                      primary="Caption Curated Count"
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="subtitle1">
                        {user.captionCuratedCount}
                      </Typography>
                    </ListItemSecondaryAction>
                    {/* <ListItemText primary={user.captionCuratedCount} /> */}
                  </ListItem>
                  <ListItem className={classes.paddingListItemText}>
                    <ListItemText
                      className={classes.itemLabel}
                      primary="Caption Edit Count"
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="subtitle1">
                        {user.captionEditCount}
                      </Typography>
                    </ListItemSecondaryAction>
                    {/* <ListItemText primary={user.captionEditCount} /> */}
                  </ListItem>
                  <ListItem className={classes.paddingListItemText}>
                    <ListItemText
                      className={classes.itemLabel}
                      primary="Caption Emotion Count"
                    />
                    <ListItemSecondaryAction>
                      <Typography variant="subtitle1">
                        {user.captionEmotionCount}
                      </Typography>
                    </ListItemSecondaryAction>
                    {/* <ListItemText primary={user.captionEmotionCount} /> */}
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </UserMutations>
    );
  }
}

export default UserDetail;
