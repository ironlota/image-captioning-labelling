import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import LinearProgress from '@material-ui/core/LinearProgress';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import deepOrange from '@material-ui/core/colors/deepOrange';
import deepPurple from '@material-ui/core/colors/deepPurple';

import EditIcon from '@material-ui/icons/Edit';

import { TextField } from 'formik-material-ui';

import redirect from '@/utils/redirect';

@withStyles(theme => ({
  formField: {
    width: '100%',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
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
}))
@withMobileDialog()
@connect(
  (state, { caption }) => ({
    open: state.caption.editCaption[caption.caption_id],
  }),
  ({ caption: { editCaption }, message: { setMessage } }) => ({
    editCaption,
    setMessage,
  })
)
class EditCaption extends Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
    fullScreen: PropTypes.bool.isRequired,

    open: PropTypes.bool,
    editCaption: PropTypes.func.isRequired,

    image: PropTypes.string.isRequired,
    objId: PropTypes.number.isRequired,
    imageId: PropTypes.string.isRequired,

    caption: PropTypes.shape({}).isRequired,

    action: PropTypes.func.isRequired,
    refetch: PropTypes.func.isRequired,

    setMessage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    open: false,
  };

  handleOpen = () => {
    const { editCaption, caption } = this.props;

    editCaption(caption, true);
  };

  handleClose = () => {
    const { editCaption, caption } = this.props;

    editCaption(caption, false);
  };

  render() {
    const {
      classes,
      fullScreen,
      open,
      action: editCaptionAction,
      caption,

      image,
      imageId,
      objId,

      refetch,
      setMessage,
    } = this.props;

    return (
      <Fragment>
        <IconButton onClick={this.handleOpen} aria-label="Delete">
          <EditIcon />
        </IconButton>
        <Formik
          initialValues={{
            text: caption.id,
            caption_id: caption.caption_id,
            image_id: imageId,
            obj_id: objId,
          }}
          validationSchema={Yup.object().shape({
            text: Yup.string()
              .min(6, 'Caption must be longer than 6 characters!')
              .required('Caption is required!'),
          })}
          onSubmit={(values, { setSubmitting }) => {
            editCaptionAction({ variables: { input: values } })
              .then(() => {
                setSubmitting(false);

                this.handleClose();
                refetch();

                setMessage({
                  message: `Edit Caption no ${caption.caption_id} SUCCESS!`,
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

                  if (statusCode === 401) {
                    redirect({}, '/login');
                  }
                } else {
                  setMessage({
                    message:
                      'Failed to EDIT the image caption, please try again',
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
                  {`Edit Caption no. ${caption.caption_id} `}
                </DialogTitle>
                <DialogContent>
                  <Card
                    style={{ height: '60%', width: '60%' }}
                    className={classes.card}
                  >
                    <CardMedia
                      className={classes.cover}
                      component="img"
                      style={{ height: '60%', width: '60%' }}
                      image={image}
                      alt={caption.en}
                      title={caption.en}
                    />
                  </Card>

                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar className={classes.orangeAvatar}>ID</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={caption.id} />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar className={classes.purpleAvatar}>EN</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={caption.en} />
                    </ListItem>
                  </List>

                  <Field
                    id="caption-field"
                    name="text"
                    type="text"
                    label="Caption"
                    helperText="New Caption"
                    margin="normal"
                    multiline
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

export default EditCaption;
