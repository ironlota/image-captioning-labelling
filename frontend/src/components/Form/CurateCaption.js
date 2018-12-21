import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { Formik, Field } from 'formik';

import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import LinearProgress from '@material-ui/core/LinearProgress';

import { Checkbox } from 'formik-material-ui';

@connect(
  () => ({}),
  ({ message: { setMessage } }) => ({
    setMessage,
  })
)
class CurateCaption extends Component {
  static propTypes = {
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
      parentClasses,
      avatarColor,

      objId,
      imageId,

      action: curateCaptionAction,

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

    const curatedCaptionsFromServer = caption ? caption.curatedCaptions : [];
    const initialValues = curatedCaptionsFromServer.reduce(
      (obj, curr) => ({
        ...obj,
        [curr]: true,
      }),
      {}
    );

    return (
      <Fragment>
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting }) => {
            const curatedCaptions = Object.entries(values)
              .filter(([, val]) => val)
              .map(([key]) => Number(key));

            curateCaptionAction
              .mutation({
                variables: {
                  input: { obj_id: objId, image_id: imageId, curatedCaptions },
                },
              })
              .then(() => {
                setSubmitting(false);
                handleNext();

                setMessage({
                  message:
                    'Captions have been CURATED, please fix them in the next step!',
                  messageType: 'success',
                  timeout: 3000,
                });
              })
              .catch(() => {
                setMessage({
                  message: 'Failed to CURATE the image, please try again',
                  messageType: 'error',
                  timeout: 3000,
                });

                setSubmitting(false);
              });
          }}
          render={({ submitForm, isSubmitting, setFieldValue, values }) => (
            <form autoComplete="off">
              {captionEdit.map((capt, idx) => (
                <ListItem
                  key={capt.caption_id}
                  dense
                  button
                  onClick={() =>
                    setFieldValue(capt.caption_id, !values[capt.caption_id])
                  }
                >
                  <ListItemAvatar>
                    <Avatar className={parentClasses[avatarColor[idx]]}>
                      {capt.caption_id}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={capt.id} secondary={capt.en} />
                  <Field name={capt.caption_id} component={Checkbox} />
                </ListItem>
              ))}
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

export default CurateCaption;
