import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import LinearProgress from '@material-ui/core/LinearProgress';

import deepOrange from '@material-ui/core/colors/deepOrange';
import deepPurple from '@material-ui/core/colors/deepPurple';

import { TextField } from 'formik-material-ui';

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
@connect(
  () => ({}),
  ({ message: { setMessage } }) => ({
    setMessage,
  })
)
class EmotionCaption extends Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
    parentClasses: PropTypes.shape({}).isRequired,
    avatarColor: PropTypes.arrayOf(PropTypes.string).isRequired,

    caption: PropTypes.shape({}).isRequired,
    captionEdit: PropTypes.arrayOf(PropTypes.shape({})).isRequired,

    objId: PropTypes.number.isRequired,
    imageId: PropTypes.string.isRequired,

    action: PropTypes.shape({}).isRequired,

    // stepper
    stepperClasses: PropTypes.shape({}).isRequired,
    activeStep: PropTypes.number.isRequired,
    handleBack: PropTypes.func.isRequired,
    handleNext: PropTypes.func.isRequired,
    steps: PropTypes.arrayOf(PropTypes.string).isRequired,

    setMessage: PropTypes.func.isRequired,
  };

  render() {
    const {
      classes,
      parentClasses,
      avatarColor,
      objId,
      imageId,
      action: emotionCaptionAction,
      caption,
      captionEdit,
      setMessage,

      // stepper
      stepperClasses,
      activeStep,
      handleBack,
      handleNext,
      steps,
    } = this.props;

    return (
      <Fragment>
        <Formik
          initialValues={{
            image_id: imageId,
            obj_id: objId,
            ...(caption ? caption.captionEmotion : {}),
          }}
          validationSchema={Yup.object().shape({
            happy: Yup.string()
              .min(6, 'Caption must be longer than 6 characters!')
              .required('Caption is required!'),
            sad: Yup.string()
              .min(6, 'Caption must be longer than 6 characters!')
              .required('Caption is required!'),
            angry: Yup.string()
              .min(6, 'Caption must be longer than 6 characters!')
              .required('Caption is required!'),
          })}
          onSubmit={({ __typename, ...values }, { setSubmitting }) => {
            emotionCaptionAction
              .mutation({ variables: { input: values } })
              .then(() => {
                setSubmitting(false);

                handleNext();

                setMessage({
                  message: `Create emotion for Image ID ${imageId} SUCCESS!`,
                  messageType: 'success',
                  timeout: 1500,
                });
              })
              .catch(() => {
                setMessage({
                  message:
                    'Failed to Create Emotion for image, please try again',
                  messageType: 'error',
                  timeout: 3000,
                });

                setSubmitting(false);
              });
          }}
          render={({ submitForm, isSubmitting }) => (
            <form autoComplete="off">
              {captionEdit.map((capt, idx) => (
                <ListItem key={capt.caption_id} dense>
                  <ListItemAvatar>
                    <Avatar className={parentClasses[avatarColor[idx]]}>
                      {capt.caption_id}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={capt.id} secondary={capt.en} />
                </ListItem>
              ))}
              <Field
                id="happy-field"
                name="happy"
                type="text"
                label="Happy Caption"
                helperText="Happy Caption"
                margin="normal"
                className={classes.formField}
                component={TextField}
              />
              <Field
                id="sad-field"
                name="sad"
                type="text"
                label="Sad Caption"
                helperText="Sad Caption"
                margin="normal"
                className={classes.formField}
                component={TextField}
              />
              <Field
                id="angry-field"
                name="angry"
                type="text"
                label="Angry Caption"
                helperText="Angry Caption"
                margin="normal"
                className={classes.formField}
                component={TextField}
              />
              <div className={stepperClasses.actionsContainer}>
                {isSubmitting && <LinearProgress />}
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={stepperClasses.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={submitForm}
                    className={stepperClasses.button}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </form>
          )}
        />
      </Fragment>
    );
  }
}

export default EmotionCaption;
