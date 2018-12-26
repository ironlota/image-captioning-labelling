import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import deepOrange from '@material-ui/core/colors/deepOrange';
import deepPurple from '@material-ui/core/colors/deepPurple';

import { TextField } from 'formik-material-ui';

@withStyles({
  formField: {
    width: '100%',
  },
  orangeAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepOrange[500],
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepPurple[500],
  },
  card: {
    margin: 'auto auto',
  },
  cover: {
    margin: 'auto auto',
    objectFit: 'cover',
  },
})
@withMobileDialog()
@connect(
  state => ({
    user: state.user,
  }),
  ({ message: { setMessage } }) => ({
    setMessage,
  })
)
class EditPassword extends Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
    fullScreen: PropTypes.bool.isRequired,

    user: PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      lastLogin: PropTypes.string,
      captionEditCount: PropTypes.number,
    }),

    action: PropTypes.func.isRequired,

    open: PropTypes.bool,
    toggleDialog: PropTypes.func.isRequired,

    setMessage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: {},
    open: false,
  };

  handleOpen = () => {
    const { toggleDialog } = this.props;

    toggleDialog(true);
  };

  handleClose = () => {
    const { toggleDialog } = this.props;

    toggleDialog(false);
  };

  render() {
    const {
      classes,
      fullScreen,

      user,
      open,

      action: editPasswordAction,

      setMessage,
    } = this.props;

    return (
      <Fragment>
        <Formik
          initialValues={{ oldPassword: '', newPassword: '' }}
          validationSchema={Yup.object().shape({
            oldPassword: Yup.string().required('Old Password is required!'),
            newPassword: Yup.string().required('Password is required!'),
            newPasswordConfirm: Yup.string()
              .oneOf([Yup.ref('newPassword'), null], 'Password does not match')
              .required('Password confirm is required'),
          })}
          onSubmit={({ newPasswordConfirm, ...rest }, { setSubmitting }) => {
            editPasswordAction({ variables: rest })
              .then(() => {
                setSubmitting(false);

                this.handleClose();

                setMessage({
                  message: `Edit ${user.username} Password  SUCCESS!`,
                  messageType: 'success',
                  timeout: 1500,
                });
              })
              .catch(err => {
                if (err) {
                  const {
                    statusCode,
                    error,
                    message,
                  } = err.graphQLErrors[0].message;

                  setMessage({
                    message: `[${statusCode}] ${error} - ${message}`,
                    messageType: 'error',
                    timeout: 1500,
                  });
                } else {
                  setMessage({
                    message: 'Failed to change password, please try again',
                    messageType: 'error',
                    timeout: 3000,
                  });
                }

                setSubmitting(false);
              });
          }}
          render={({ submitForm, isSubmitting }) => (
            <form autoComplete="off">
              <Dialog
                open={open}
                fullScreen={fullScreen}
                onClose={this.handleClose}
                scroll="body"
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  {`Edit Password for ${user.username} `}
                </DialogTitle>
                <DialogContent>
                  <Field
                    id="oldPassword-field"
                    name="oldPassword"
                    type="password"
                    label="Old Password"
                    helperText="Insert Old Password"
                    margin="normal"
                    className={classes.formField}
                    component={TextField}
                  />
                  <Field
                    id="newPassword-field"
                    name="newPassword"
                    type="password"
                    label="New Password"
                    helperText="Insert your New Password"
                    margin="normal"
                    className={classes.formField}
                    component={TextField}
                  />
                  <Field
                    id="newPasswordConfirm-field"
                    name="newPasswordConfirm"
                    type="password"
                    label="New Password"
                    helperText="Confirm your New Password"
                    margin="normal"
                    className={classes.formField}
                    component={TextField}
                  />
                </DialogContent>
                <DialogActions>
                  {isSubmitting && <LinearProgress />}
                  <Button onClick={this.handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={submitForm} color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
            </form>
          )}
        />
      </Fragment>
    );
  }
}

export default EditPassword;
