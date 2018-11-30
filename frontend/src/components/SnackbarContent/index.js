import { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';

import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';

@withStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}))
class CustomSnackbarContent extends Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
    className: PropTypes.string,
    message: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info'])
      .isRequired,
  };

  static defaultProps = {
    className: '',
    message: '',
    onClose: () => {},
  };

  variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
  };

  messageComponent = () => {
    const { classes, message, variant } = this.props;

    const Icon = this.variantIcon[variant];

    return (
      <span id="client-snackbar" className={classes.message}>
        <Icon className={classNames(classes.icon, classes.iconVariant)} />
        {message}
      </span>
    );
  };

  render() {
    const {
      classes,
      className,
      message,
      onClose,
      variant,
      ...other
    } = this.props;

    return (
      <SnackbarContent
        className={classNames(classes[variant], className)}
        aria-describedby="client-snackbar"
        message={this.messageComponent()}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={onClose}
          >
            <CloseIcon className={classes.icon} />
          </IconButton>,
        ]}
        {...other}
      />
    );
  }
}

export default CustomSnackbarContent;
