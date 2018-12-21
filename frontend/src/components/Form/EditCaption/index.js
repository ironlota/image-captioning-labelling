import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import EditCaptionForm from './EditCaptionForm';

class EditCaption extends Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
    parentClasses: PropTypes.shape({}).isRequired,
    avatarColor: PropTypes.arrayOf(PropTypes.string).isRequired,

    editCaption: PropTypes.func.isRequired,

    objId: PropTypes.number.isRequired,
    imageId: PropTypes.string.isRequired,

    image: PropTypes.string.isRequired,
    caption: PropTypes.shape({}).isRequired,
    captionEdit: PropTypes.arrayOf(PropTypes.shape({})).isRequired,

    action: PropTypes.shape({}).isRequired,
    refetch: PropTypes.func.isRequired,

    // stepper
    stepperClasses: PropTypes.shape({}).isRequired,
    activeStep: PropTypes.number.isRequired,
    handleBack: PropTypes.func.isRequired,
    handleNext: PropTypes.func.isRequired,
    steps: PropTypes.arrayOf(PropTypes.string).isRequired,
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
      avatarColor,
      parentClasses,

      action,
      caption,
      captionEdit,

      image,
      refetch,

      objId,
      imageId,

      // stepper
      stepperClasses,
      activeStep,
      handleBack,
      handleNext,
      steps,
    } = this.props;

    const showCuratedCaption = captionEdit.filter(capt =>
      (caption ? caption.curatedCaptions : []).includes(capt.caption_id)
    );

    return (
      <Fragment>
        {(showCuratedCaption || []).length === 0 ? (
          <Typography variant="subtitle2">
            Nothing to edit, click next :)
          </Typography>
        ) : (
          (showCuratedCaption || captionEdit).map((capt, idx) => (
            <Fragment key={capt.caption_id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar className={parentClasses[avatarColor[idx]]}>
                    {capt.caption_id}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={capt.id} secondary={capt.en} />
                <ListItemSecondaryAction>
                  <EditCaptionForm
                    image={image}
                    imageId={imageId}
                    objId={objId}
                    caption={capt}
                    action={action.mutation}
                    refetch={refetch}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              {idx !== showCuratedCaption.length - 1 && (
                <li>
                  <Divider inset />
                </li>
              )}
            </Fragment>
          ))
        )}
        <div className={stepperClasses.actionsContainer}>
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
              onClick={handleNext}
              className={stepperClasses.button}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default EditCaption;
