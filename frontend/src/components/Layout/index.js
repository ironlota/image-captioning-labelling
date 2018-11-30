import { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';

import SnackbarContent from '@/components/SnackbarContent';

import Navbar from './NavBar';

@withStyles({
  root: {
    textAlign: 'center',
  },
})
@connect(
  state => ({
    message: state.message,
  }),
  ({ message: { clearMessage } }) => ({ clearMessage })
)
class Layout extends Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
    children: PropTypes.node.isRequired,

    message: PropTypes.shape({}).isRequired,
    clearMessage: PropTypes.func.isRequired,
  };

  render() {
    const { children, classes, message, clearMessage } = this.props;
    const { openSnackbar, snackbarType, messageSnackbar } = message;

    return (
      <Paper className={classes.root}>
        <Navbar />
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={openSnackbar}
          ContentProps={{ 'aria-describedby': 'message-id' }}
        >
          <SnackbarContent
            onClose={() => clearMessage()}
            variant={snackbarType}
            message={messageSnackbar}
          />
        </Snackbar>
        {children}
      </Paper>
    );
  }
}
export default Layout;
