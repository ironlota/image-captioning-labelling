import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { ApolloConsumer } from 'react-apollo';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import range from 'lodash/range';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import InputLabel from '@material-ui/core/InputLabel';

import LinearProgress from '@material-ui/core/LinearProgress';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import { Select } from 'formik-material-ui';

import { Q_GET_IMAGES, Q_CURRENT_USER } from '@/graphql/queries';

@withStyles({
  formControl: {
    width: '100%',
  },
})
@withMobileDialog()
@connect(
  state => ({
    user: state.user,
  }),
  ({ message: { setMessage }, user: { setUser } }) => ({
    setMessage,
    setUser,
  })
)
class EditRange extends Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
    fullScreen: PropTypes.bool.isRequired,

    user: PropTypes.shape({
      username: PropTypes.string,
      range: PropTypes.string,
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
    setUser: PropTypes.func.isRequired,
  };

  IMAGE_DOCUMENTS = process.env.IMAGE_DOCUMENTS
    ? parseInt(process.env.IMAGE_DOCUMENTS, 10)
    : 0;

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

      action: editRangeAction,

      setMessage,
      setUser,
    } = this.props;

    return (
      <ApolloConsumer>
        {client => (
          <Fragment>
            <Formik
              initialValues={{ range: user.range }}
              validationSchema={Yup.object().shape({
                range: Yup.string()
                  .matches(
                    /^(((\d*)-(\d*))|(all))/g,
                    'Please enter wether [all, start-end] only.'
                  )
                  .required('Range is required!'),
              })}
              onSubmit={(value, { setSubmitting }) => {
                editRangeAction({
                  variables: value,
                  refetchQueries: [{ query: Q_GET_IMAGES }],
                  // refetchQueries: () => ['getAllImages'],
                })
                  .then(async () => {
                    setSubmitting(false);

                    this.handleClose();

                    setMessage({
                      message: 'Edit Image Range SUCCESS!',
                      messageType: 'success',
                      timeout: 1500,
                    });

                    const {
                      data: { currentUser },
                    } = await client.query({
                      query: Q_CURRENT_USER,
                      fetchPolicy: 'network-only',
                    });
                    setUser(currentUser);
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
                        message:
                          'Failed to change the image range, please try again',
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
                      {`Edit Range for ${user.username} `}
                    </DialogTitle>
                    <DialogContent>
                      <FormControl className={classes.formControl}>
                        <InputLabel shrink htmlFor="range">
                          Image Range
                        </InputLabel>
                        <Field
                          name="range"
                          component={Select}
                          inputProps={{ name: 'range', id: 'range' }}
                          native
                        >
                          <option value="all">All</option>
                          {range(1, this.IMAGE_DOCUMENTS, 5000).map(val => {
                            let value = `${val}-${val + 4999}`;

                            if (val + 4999 > this.IMAGE_DOCUMENTS + 1) {
                              value = `${val}-${this.IMAGE_DOCUMENTS}`;
                            }

                            return (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            );
                          })}
                        </Field>
                        <FormHelperText>Select Image Range</FormHelperText>
                      </FormControl>
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
        )}
      </ApolloConsumer>
    );
  }
}

export default EditRange;
