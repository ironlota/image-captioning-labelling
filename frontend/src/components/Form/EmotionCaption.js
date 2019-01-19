import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import capitalize from 'lodash/capitalize';
import isEmpty from 'lodash/isEmpty';

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

import redirect from '@/utils/redirect';

import { Q_GET_IMAGES } from '@/graphql/queries';

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
  ({ user }) => ({ user }),
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
    // activeStep: PropTypes.number.isRequired,
    // handleBack: PropTypes.func.isRequired,
    // handleNext: PropTypes.func.isRequired,
    // steps: PropTypes.arrayOf(PropTypes.string).isRequired,

    user: PropTypes.shape({}).isRequired,
    setMessage: PropTypes.func.isRequired,
  };

  FieldForm = name => {
    const { classes } = this.props;

    return (
      <Field
        id={`${name}-field`}
        name={name}
        type="text"
        label={`${capitalize(name)} Caption`}
        helperText={`${capitalize(
          name
        )} caption must be longer than 6 characters`}
        margin="normal"
        multiline
        className={classes.formField}
        component={TextField}
      />
    );
  };

  renderFieldForm = selectedEmotion => {
    if (selectedEmotion === 'all') {
      return (
        <Fragment>
          {this.FieldForm('happy')}
          {this.FieldForm('sad')}
          {this.FieldForm('angry')}
        </Fragment>
      );
    }

    return this.FieldForm(selectedEmotion);
  };

  validateForm = selectedEmotion => {
    const validationSchema = Yup.string()
      .min(6, 'Caption must be longer than 6 characters!')
      .required('Caption is required!');

    if (selectedEmotion === 'all') {
      return {
        happy: validationSchema,
        sad: validationSchema,
        angry: validationSchema,
      };
    }

    return {
      [selectedEmotion]: validationSchema,
    };
  };

  render() {
    const {
      parentClasses,
      avatarColor,
      objId,
      imageId,
      action: emotionCaptionAction,
      caption,
      captionEdit,

      // redux
      user,
      setMessage,

      // stepper
      // stepperClasses,
      // activeStep,
      // handleBack,
      // handleNext,
      // steps,
    } = this.props;

    let initialValues = {
      image_id: imageId,
      obj_id: objId,
      sad: '',
      angry: '',
      happy: '',
    };

    if (caption && !isEmpty(caption.captionEmotion)) {
      initialValues = { ...initialValues, ...caption.captionEmotion };

      Object.keys(initialValues).forEach(key => {
        if (!initialValues[key]) {
          initialValues[key] = '';
        }
      });
    }

    return (
      <Fragment>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object().shape(
            this.validateForm(user.selectedEmotion || 'all')
          )}
          onSubmit={({ __typename, ...values }, { setSubmitting }) => {
            emotionCaptionAction
              .mutation({
                variables: { input: values },
                refetchQueries: [{ query: Q_GET_IMAGES }],
              })
              .then(() => {
                setSubmitting(false);

                // handleNext();

                setMessage({
                  message: `Create emotion for Image ID ${imageId} SUCCESS!`,
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
                      'Failed to Create Emotion for image, please try again',
                    messageType: 'error',
                    timeout: 3000,
                  });
                }

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
              {['happy', 'sad', 'angry'].map((key, idx) =>
                isEmpty(initialValues[key]) ? (
                  <Fragment />
                ) : (
                  <ListItem key={key} dense>
                    <ListItemAvatar>
                      <Avatar className={parentClasses[avatarColor[idx]]}>
                        {capitalize(key)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={initialValues[key]}
                      // secondary={capt.en}
                    />
                  </ListItem>
                  // <Typography key={key}>
                  //   {`${capitalize(key)} : ${initialValues[key]}`}
                  // </Typography>
                )
              )}
              {this.renderFieldForm(user.selectedEmotion || 'all')}
              <div>
                {isSubmitting && <LinearProgress />}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitForm}
                >
                  Finish
                </Button>
                {/* <div>
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
                </div> */}
              </div>
            </form>
          )}
        />
      </Fragment>
    );
  }
}

export default EmotionCaption;
