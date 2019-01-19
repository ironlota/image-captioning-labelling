import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { Mobile, DesktopOrTablet } from '@/components/Responsive';

@withStyles(
  theme => ({
    root: {
      width: '100%',
    },
    rootMobile: {
      maxWidth: 400,
      flexGrow: 1,
    },
    button: {
      marginTop: theme.spacing.unit,
      marginRight: theme.spacing.unit,
    },
    actionsContainer: {
      marginBottom: theme.spacing.unit * 2,
    },
    resetContainer: {
      padding: theme.spacing.unit * 3,
    },
  }),
  { withTheme: true }
)
@connect(
  ({ caption }, { id }) => ({
    activeStepCurated: caption.curatedCaption[id],
  }),
  ({ caption: { curatedCaptionStep }, message: { setMessage } }) => ({
    curatedCaptionStep,
    setMessage,
  })
)
class VerticalLinearStepper extends React.Component {
  static propTypes = {
    classes: PropTypes.shape({}),
    theme: PropTypes.shape({}),

    caption: PropTypes.shape({}).isRequired,

    activeStepCurated: PropTypes.number,
    curatedCaptionStep: PropTypes.func,
    id: PropTypes.string,
    objId: PropTypes.number,

    needEmotion: PropTypes.bool,

    refetch: PropTypes.func.isRequired,
    changeStepCaption: PropTypes.func.isRequired,

    curateForm: PropTypes.func.isRequired,
    editForm: PropTypes.func.isRequired,
    // emotionForm: PropTypes.func.isRequired,
  };

  static defaultProps = {
    classes: {},
    theme: {},
    activeStepCurated: 0,
    curatedCaptionStep: () => {},
    needEmotion: true,
    id: '',
    objId: 0,
  };

  getSteps() {
    const { needEmotion } = this.props;

    const defaultSteps = [
      'Curating (check the caption that needs editing)',
      'Editing',
    ];

    // if (needEmotion) {
    //   return [...defaultSteps, 'Create emotion'];
    // }

    return defaultSteps;
  }

  handleNext = () => {
    const {
      activeStepCurated,
      curatedCaptionStep,
      id,
      refetch,
      objId,
      changeStepCaption,
    } = this.props;
    curatedCaptionStep({
      image_id: id,
      step: activeStepCurated + 1,
      callback: () =>
        changeStepCaption({
          variables: { objId, status: this.mappingStep(activeStepCurated + 1) },
        })
          .then(() => {
            refetch();
          })
          .catch(() => {}),
    });
  };

  handleBack = () => {
    const {
      activeStepCurated,
      curatedCaptionStep,
      changeStepCaption,
      id,
      refetch,
      objId,
    } = this.props;
    curatedCaptionStep({
      image_id: id,
      step: activeStepCurated - 1,
      callback: () =>
        changeStepCaption({
          variables: { objId, status: this.mappingStep(activeStepCurated - 1) },
        })
          .then(() => {
            refetch();
          })
          .catch(() => {}),
    });
  };

  handleReset = () => {
    const {
      curatedCaptionStep,
      id,
      refetch,
      changeStepCaption,
      objId,
    } = this.props;
    curatedCaptionStep({
      image_id: id,
      step: 0,
      callback: () =>
        changeStepCaption({
          variables: { objId, status: this.mappingStep(0) },
        })
          .then(() => {
            refetch();
          })
          .catch(() => {}),
    });
  };

  mappingStep(step) {
    if (step === 0) {
      return 'none';
    }
    if (step === 1) {
      return 'curated';
    }
    if (step === 2) {
      return 'edited';
    }
    // if (step === 3) {
    //   return 'emotion';
    // }
  }

  render() {
    const {
      activeStepCurated,
      classes,
      curateForm,
      editForm,
      // emotionForm,
    } = this.props;

    const steps = this.getSteps();

    return (
      <div className={classes.root}>
        <DesktopOrTablet>
          <Stepper activeStep={activeStepCurated} orientation="vertical">
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {index === 0 &&
                    curateForm({
                      back: this.handleBack,
                      next: this.handleNext,
                      stepperClasses: classes,
                      activeStep: activeStepCurated,
                      steps,
                    })}
                  {index === 1 &&
                    editForm({
                      back: this.handleBack,
                      next: this.handleNext,
                      stepperClasses: classes,
                      activeStep: activeStepCurated,
                      steps,
                    })}
                  {/* {index === 2 &&
                    emotionForm({
                      back: this.handleBack,
                      next: this.handleNext,
                      stepperClasses: classes,
                      activeStep: activeStepCurated,
                      steps,
                    })} */}
                </StepContent>
              </Step>
            ))}
          </Stepper>
          {activeStepCurated === steps.length && (
            <Paper square elevation={0} className={classes.resetContainer}>
              <Typography>
                All steps completed - you&apos;re finished
              </Typography>
              <Button onClick={this.handleReset} className={classes.button}>
                Reset
              </Button>
            </Paper>
          )}
        </DesktopOrTablet>
        <Mobile>
          <Typography variant="title">
            {`${activeStepCurated + 1}. ${steps[activeStepCurated]}`}
          </Typography>
          <div className={classes.rootMobile}>
            {activeStepCurated === 0 &&
              curateForm({
                back: this.handleBack,
                next: this.handleNext,
                stepperClasses: classes,
                activeStep: activeStepCurated,
                steps,
              })}
            {activeStepCurated === 1 &&
              editForm({
                back: this.handleBack,
                next: this.handleNext,
                stepperClasses: classes,
                activeStep: activeStepCurated,
                steps,
              })}
            {/* {activeStepCurated === 2 &&
              emotionForm({
                back: this.handleBack,
                next: this.handleNext,
                stepperClasses: classes,
                activeStep: activeStepCurated,
                steps,
              })} */}
          </div>
        </Mobile>
      </div>
    );
  }
}

export default VerticalLinearStepper;
